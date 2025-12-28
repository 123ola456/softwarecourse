import { OrderPgRepository } from "../src/postgresql/orderpg.repository";
import { ConnectionManager } from "../src/postgresql/ConnectionManager";
import { DbException, ItemNotFoundException } from "../src/utils/Exceptions/repositoryExceptions";
import { Intializable, Irepository } from "../src/repository/Irepository";

jest.mock("../src/postgresql/ConnectionManager", () => ({
  ConnectionManager: {
    getConnection: jest.fn(),
  },
}));

const mockItemRepo: Irepository<any>& Intializable = {
  init: jest.fn(),
  create: jest.fn(),
  get: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

describe("OrderPgRepository (PostgreSQL)", () => {
  let repo: OrderPgRepository;

  beforeEach(() => {
    repo = new OrderPgRepository(mockItemRepo);
    mockClient.query.mockReset();
    mockClient.release.mockReset();

    (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockClient);
  });


  // INIT

  test("init() initializes table and itemRepository", async () => {
    mockItemRepo.init = jest.fn().mockResolvedValue(undefined);
    mockClient.query.mockResolvedValue(undefined);

    await repo.init();

    expect(mockClient.query).toHaveBeenCalled();
    expect(mockItemRepo.init).toHaveBeenCalled();
    expect(mockClient.release).toHaveBeenCalled();
  });


  // CREATE
  test("create() inserts order + related item and commits transaction", async () => {
    const fakeOrder = {
      getId: () => "O1",
      getQuantity: () => 3,
      getPrice: () => 99,
      getItem: () => ({
        getId: () => "ITEM123",
        getCategory: () => "TOY",
      }),
    };

    mockItemRepo.create = jest.fn().mockResolvedValue("ITEM123");

    mockClient.query.mockResolvedValueOnce(undefined); // BEGIN
    mockClient.query.mockResolvedValueOnce(undefined); // INSERT_ORDER
    mockClient.query.mockResolvedValueOnce(undefined); // COMMIT

    const id = await repo.create(fakeOrder as any);

    expect(id).toBe("O1");
    expect(mockClient.query.mock.calls[0][0]).toBe("BEGIN");
    expect(mockItemRepo.create).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO"),
      ["O1", 3, 99, "TOY", "ITEM123"]
    );
    expect(mockClient.query.mock.calls[2][0]).toBe("COMMIT");
  });

  test("create() rolls back on failure", async () => {
    const fakeOrder = {
      getId: () => "ERR1",
      getQuantity: () => 3,
      getPrice: () => 22,
      getItem: () => ({ getId: () => "X", getCategory: () => "TOY" }),
    };

    mockItemRepo.create = jest.fn().mockRejectedValue(new Error("fail"));

    mockClient.query.mockResolvedValueOnce(undefined); // BEGIN
    mockClient.query.mockResolvedValueOnce(undefined); // ROLLBACK

    await expect(repo.create(fakeOrder as any)).rejects.toThrow(DbException);

    expect(mockClient.query.mock.calls[1][0]).toBe("ROLLBACK");
  });

  // ---------------------------------------------------------
  // GET
  // ---------------------------------------------------------
  test("get() returns mapped order", async () => {
    mockClient.query.mockResolvedValue({
      rowCount: 1,
      rows: [{ id: "O1", item_id: "ITEM1", quantity: 2, price: 20 }],
    });

    mockItemRepo.get = jest.fn().mockResolvedValue({
      getId: () => "ITEM1",
      getCategory: () => "TOY",
    });

    const result = await repo.get("O1");

    expect(mockClient.query).toHaveBeenCalledWith(expect.any(String), ["O1"]);
    expect(mockItemRepo.get).toHaveBeenCalledWith("ITEM1");
    expect(result).toBeDefined();
  });

  test("get() throws ItemNotFoundException when empty", async () => {
    mockClient.query.mockResolvedValue({ rowCount: 0, rows: [] });

    await expect(repo.get("404")).rejects.toThrow(ItemNotFoundException);
  });

  // ---------------------------------------------------------
  // GET ALL
  // ---------------------------------------------------------
  test("getAll() returns empty array when no items exist", async () => {
    mockItemRepo.getAll = jest.fn().mockResolvedValue([]);

    const result = await repo.getAll();

    expect(result).toEqual([]);
  });

  test("getAll() maps orders to items correctly", async () => {
    mockItemRepo.getAll = jest.fn().mockResolvedValue([
      { getId: () => "ITEM1", getCategory: () => "TOY" },
    ]);

    mockClient.query.mockResolvedValue({
      rows: [
        { id: "O1", item_id: "ITEM1", quantity: 2, price: 40 },
        { id: "O2", item_id: "ITEM1", quantity: 5, price: 99 },
      ],
    });

    const result = await repo.getAll();

    expect(result.length).toBe(2);
  });

  // ---------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------
  test("update() updates order + item and commits", async () => {
    const fakeOrder = {
      getId: () => "O1",
      getQuantity: () => 4,
      getPrice: () => 70,
      getItem: () => ({
        getId: () => "ITEM1",
        getCategory: () => "TOY",
      }),
    };

    mockItemRepo.update = jest.fn().mockResolvedValue(undefined);

    mockClient.query.mockImplementation((query: string) => {
      if (query.includes("UPDATE")) {
        return { rowCount: 1 };
      }
      return undefined;
    });

    await repo.update(fakeOrder as any);

    expect(mockClient.query.mock.calls[0][0]).toBe("BEGIN");
    expect(mockItemRepo.update).toHaveBeenCalled();
    expect(mockClient.query.mock.calls[2][0]).toBe("COMMIT");
  });

  test("update() rolls back on failure", async () => {
    const fakeOrder = {
      getId: () => "EE1",
      getQuantity: () => 3,
      getPrice: () => 11,
      getItem: () => ({ getId: () => "ITEM1", getCategory: () => "TOY" }),
    };

    mockItemRepo.update = jest.fn().mockRejectedValue(new Error("fail"));

    mockClient.query.mockResolvedValueOnce(undefined); // BEGIN
    mockClient.query.mockResolvedValueOnce(undefined); // ROLLBACK

    await expect(repo.update(fakeOrder as any)).rejects.toThrow(DbException);

    expect(mockClient.query.mock.calls[1][0]).toBe("ROLLBACK");
  });

  // ---------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------
  test("delete() deletes item + order", async () => {
    mockItemRepo.delete = jest.fn().mockResolvedValue(undefined);

    mockClient.query.mockImplementation((query: string) => {
      if (query.includes("DELETE")) return { rowCount: 1 };
      return undefined;
    });

    await repo.delete("O1");

    expect(mockClient.query.mock.calls[0][0]).toBe("BEGIN");
    expect(mockItemRepo.delete).toHaveBeenCalledWith("O1");
    expect(mockClient.query.mock.calls[2][0]).toBe("COMMIT");
  });

  test("delete() throws ItemNotFoundException if order not found", async () => {
    mockItemRepo.delete = jest.fn().mockResolvedValue(undefined);

    mockClient.query.mockResolvedValueOnce(undefined); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 0 }); // DELETE
    mockClient.query.mockResolvedValueOnce(undefined); // ROLLBACK

    await expect(repo.delete("NOPE")).rejects.toThrow(ItemNotFoundException);

    expect(mockClient.query.mock.calls[2][0]).toBe("ROLLBACK");
  });
});
