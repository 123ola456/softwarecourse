import { ToyPgRepository } from "../src/postgresql/toypg.repository";
import { IdentifiableToy } from "../src/model/toy.model";
import { ConnectionManager } from "../src/postgresql/ConnectionManager";
import { DbException, IntailizationException, ItemNotFoundException } from "../src/utils/Exceptions/repositoryExceptions";

// create a fake connection 
jest.mock("../src/postgresql/ConnectionManager");
const mockQuery = jest.fn();
const mockRelease = jest.fn();
// mockResolvedValue because getConnection is async and returns a promise
(ConnectionManager.getConnection as jest.Mock).mockResolvedValue({
  query: mockQuery,   // instead of real client query
  release: mockRelease, // instead of real client release
});

describe("ToyPgRepository", () => {
  let repo: ToyPgRepository;
  let toy: IdentifiableToy;

  /*Before each test, we create a fresh instance of the ToyPgRepository
  and a new IdentifiableToy object to ensure tests do not affect each other.*/
  beforeEach(() => {
    repo = new ToyPgRepository();
    toy = new IdentifiableToy(
      "5001",              // OrderID
      "Plush Toy",         // Type
      "13+",               // AgeGroup
      "FunTime",           // Brand
      "Fabric",            // Material
      true,                // BatteryRequired
      true                 // Educational
    );
    // reset mock functions before each test
    mockQuery.mockReset();
    mockRelease.mockReset();
  });

  test("should initialize toy table", async () => {
    // 1. We mock the database query to simulate a successful response.
    //    mockResolvedValueOnce({}) means that when mockQuery is called, it returns a resolved Promise with an empty object.
    //    This simulates a successful SQL execution without actually connecting to a real database.
    mockQuery.mockResolvedValueOnce({});
    // 2 we call the init method which should create the table if id doesnt exists,it should be resolved without throwing an error
    await expect(repo.init()).resolves.not.toThrow();
    // 3. We verify that the mockQuery function was called with a SQL statement containing "CREATE TABLE".
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE"));
  });

  test("should create a toy successfully", async () => {
    mockQuery.mockResolvedValueOnce({});
    const id = await repo.create(toy);
    expect(id).toBe("5001");
    // expect.any(Array) is used to check that the second argument is an array (the values to insert)
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO"), expect.any(Array));
    expect(mockRelease).toHaveBeenCalled();
  });

  test("should get a toy by id", async () => {
    mockQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          id: "5001",
          type: "Plush Toy",
          ageGroup: "13+",
          brand: "FunTime",
          material: "Fabric",
          batteryRequired: true,
          educational: true,
        },
      ],
    });

    const result = await repo.get("5001");
    expect(result.getId()).toBe("5001"); 
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("WHERE id = $1"), ["5001"]);
    expect(mockRelease).toHaveBeenCalled();
  });

  test("should return all toys", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: "5001",
          type: "Plush Toy",
          ageGroup: "13+",
          brand: "FunTime",
          material: "Fabric",
          batteryRequired: true,
          educational: true,
        },
        {
          id: "5002",
          type: "Building Blocks",
          ageGroup: "8-12",
          brand: "BuildSmart",
          material: "Plastic",
          batteryRequired: true,
          educational: true,
        },
      ],
    });

    const result = await repo.getAll();
    expect(result.length).toBe(2);
    expect(result[0].getId()).toBe("5001");
    expect(result[1].getId()).toBe("5002");
  });

  test("should update a toy successfully", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    await expect(repo.update(toy)).resolves.not.toThrow();
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("UPDATE"), expect.any(Array));
  });

  test("should throw ItemNotFoundException when updating non-existing toy", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });
    await expect(repo.update(toy)).rejects.toThrow(ItemNotFoundException);
  });

  test("should delete a toy successfully", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    await expect(repo.delete("5001")).resolves.not.toThrow();
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("DELETE"), ["5001"]);
    expect(mockRelease).toHaveBeenCalled();
  });

  test("should throw ItemNotFoundException when deleting non-existing toy", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });
    await expect(repo.delete("5001")).rejects.toThrow(ItemNotFoundException);
  });

  test("should throw DbException if create fails (simulate duplicate or DB error)", async () => {
    mockQuery.mockRejectedValueOnce(new Error("duplicate key"));
    await expect(repo.create(toy)).rejects.toThrow(DbException);
  });

  test("should handle null or undefined values gracefully", async () => {
    const invalidToy = new IdentifiableToy(
      "5002",
      "" as any, // type cast to simulate null/empty
      null as any,
      "Brand",
      "Material",
      true,
      true
    );
    mockQuery.mockRejectedValueOnce(new Error("null value violates not-null constraint"));
    await expect(repo.create(invalidToy)).rejects.toThrow(DbException);
  });

  test("should rollback transaction on create error", async () => {
    const mockClient = {
      query: jest.fn()
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(new Error("insert failed")), // INSERT fails
      release: jest.fn()
    };
    (ConnectionManager.getConnection as jest.Mock).mockResolvedValueOnce(mockClient);

    await expect(repo.create(toy)).rejects.toThrow(DbException);
    expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK"); 
    expect(mockClient.release).toHaveBeenCalled(); //  close the connection
  });

  test("should throw ItemNotFoundException if toy missing", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    await expect(repo.get("5001")).rejects.toThrow(ItemNotFoundException);
  });

  test("should throw DbException on get failure", async () => {
    mockQuery.mockRejectedValueOnce(new Error("connection lost"));
    await expect(repo.get("5001")).rejects.toThrow(DbException);
  });
});
