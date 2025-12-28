
import { CakePgRepository } from "../src/postgresql/cakepg.repository";
import { IdentifiableCake } from "../src/model/cake.model";
import { ConnectionManager } from "../src/postgresql/ConnectionManager";
import { DbException, ItemNotFoundException } from "../src/utils/Exceptions/repositoryExceptions";

jest.mock("../src/postgresql/ConnectionManager");

const mockQuery = jest.fn();
const mockRelease = jest.fn();

(ConnectionManager.getConnection as jest.Mock).mockResolvedValue({
  query: mockQuery,
  release: mockRelease
});

describe("CakePgRepository", () => {
  let repo: CakePgRepository;
  let cake: IdentifiableCake;

  beforeEach(() => {
    repo = new CakePgRepository();
    cake = new IdentifiableCake(
      "cake123",
      "Chocolate",
      "Chocolate",
      "Ganache",
      8,
      2,
      "Buttercream",
      "Vanilla",
      "Sprinkles",
      "Red",
      "Happy Birthday",
      "Round",
      "None",
      "Extra Cocoa",
      "Box"
    );

    mockQuery.mockReset();
    mockRelease.mockReset();
  });



  test("should initialize table", async () => {
    mockQuery.mockResolvedValueOnce({});
    await expect(repo.init()).resolves.not.toThrow();
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE"));
  });

  test("should create a cake successfully", async () => {
    mockQuery.mockResolvedValueOnce({});
    const id = await repo.create(cake);
    expect(id).toBe("cake123");
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO"), expect.any(Array));
    expect(mockRelease).toHaveBeenCalled();
  });

  test("should get a cake by id", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1, rows: [cake] });
    const result = await repo.get("cake123");
    expect(result.getId()).toBe("cake123");
    expect(mockRelease).toHaveBeenCalled();
  });

  test("should throw ItemNotFoundException if cake not found", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    await expect(repo.get("cake123")).rejects.toThrow(ItemNotFoundException);
  });

  test("should get all cakes", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [cake] });
    const results = await repo.getAll();
    expect(results.length).toBe(1);
    expect(results[0].getId()).toBe("cake123");
  });

  test("should update a cake successfully", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    await expect(repo.update(cake)).resolves.not.toThrow();
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("UPDATE"), expect.any(Array));
  });

  test("should throw ItemNotFoundException when updating non-existing cake", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });
    await expect(repo.update(cake)).rejects.toThrow(ItemNotFoundException);
  });

  test("should delete a cake successfully", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    await expect(repo.delete("cake123")).resolves.not.toThrow();
  });

  test("should throw ItemNotFoundException when deleting non-existing cake", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });
    await expect(repo.delete("cake123")).rejects.toThrow(ItemNotFoundException);
  });



  test("should throw DbException if create fails (simulate duplicate or DB error)", async () => {
    mockQuery.mockRejectedValueOnce(new Error("duplicate key"));
    await expect(repo.create(cake)).rejects.toThrow(DbException);
  });

  test("should handle null or undefined values gracefully", async () => {
    const invalidCake = new IdentifiableCake(
      "cake124",
      "" as any, // type cast to simulate null/empty
      null as any,
      "Filling",
      8,
      2,
      "Buttercream",
      "Vanilla",
      "Sprinkles",
      "Red",
      "Message",
      "Round",
      "None",
      "Extra",
      "Box"
    );
    mockQuery.mockRejectedValueOnce(new Error("null value violates not-null constraint"));
    await expect(repo.create(invalidCake)).rejects.toThrow(DbException);
  });

  test("should rollback transaction on create error", async () => {
    // simulate client.query("BEGIN") then error
    const mockClient = {
      query: jest.fn()
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(new Error("insert failed")), // INSERT
      release: jest.fn()
    };
    (ConnectionManager.getConnection as jest.Mock).mockResolvedValueOnce(mockClient);

    await expect(repo.create(cake)).rejects.toThrow(DbException);
    expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    expect(mockClient.release).toHaveBeenCalled();
  });
});
