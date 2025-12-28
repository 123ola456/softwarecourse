import { BookPgRepository } from "../src/postgresql/bookpg.repository";
import { IdentifiableBook } from "../src/model/book.model";
import { ConnectionManager } from "../src/postgresql/ConnectionManager";
import { DbException, ItemNotFoundException, IntailizationException } 
from "../src/utils/Exceptions/repositoryExceptions";

// create a fake connection 
jest.mock("../src/postgresql/ConnectionManager");

const mockQuery = jest.fn();
const mockRelease = jest.fn();

// mockResolvedValue because getConnection is async and returns a promise
(ConnectionManager.getConnection as jest.Mock).mockResolvedValue({
  query: mockQuery, // instead of real client query
  release: mockRelease, // instead of real client release
});

describe("BookPgRepository", () => {
  let repo: BookPgRepository;
  let book: IdentifiableBook;

  /* Before each test, we create a fresh instance of the BookPgRepository
     and a new IdentifiableBook object to ensure tests do not affect each other. */
  beforeEach(() => {
    repo = new BookPgRepository();

    // Mapping your JSON fields to your IdentifiableBook constructor
    book = new IdentifiableBook(
      "2001",                      // Order ID → id
      "Edge of Eternity",          // Book Title → title
      "Dan Brown",                 // Author
      "Science Fiction",           // Genre
      "Paperback",                 // Format
      "French",                    // Language
      "Oxford Press",              // Publisher
      "Signed Copy",               // Special Edition → isbn temporarily
      "Eco-Friendly Packaging"     // Packaging → pages OR extra field if exists
    );

    // reset mock functions before each test
    mockQuery.mockReset();
    mockRelease.mockReset();
  });

  // INIT
  test("should initialize the book table", async () => {
    mockQuery.mockResolvedValueOnce({});
    // calling init should not throw
    await expect(repo.init()).resolves.not.toThrow();
    // verify CREATE TABLE query was called
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE"));
  });

  test("should throw IntailizationException if init fails", async () => {
    mockQuery.mockRejectedValueOnce(new Error("connection error"));
    await expect(repo.init()).rejects.toThrow(IntailizationException);
  });

  // CREATE
  test("should create a book successfully", async () => {
    mockQuery.mockResolvedValueOnce({});
    const result = await repo.create(book);
    expect(result).toBe("2001");
    // expect.any(Array) checks the second argument is an array
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO"), expect.any(Array));
    expect(mockRelease).toHaveBeenCalled();
  });

  test("should throw DbException if create fails (duplicate key)", async () => {
    mockQuery.mockRejectedValueOnce(new Error("duplicate key"));
    await expect(repo.create(book)).rejects.toThrow(DbException);
  });

  test("should handle invalid book input gracefully", async () => {
    const invalid = new IdentifiableBook(
      "2001",
      "" as any,
      null as any,
      "Genre",
      "Format",
      "Lang",
      "Publisher",
      "Special",
      "Package"
    );

    mockQuery.mockRejectedValueOnce(new Error("invalid input"));
    await expect(repo.create(invalid)).rejects.toThrow(DbException);
  });

  // GET
  test("should get a book by id", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1, rows: [book] });
    const result = await repo.get("2001");
    expect(result.getId()).toBe("2001");
    expect(mockRelease).toHaveBeenCalled();
  });

  test("should throw ItemNotFoundException if book not found", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    await expect(repo.get("2001")).rejects.toThrow(ItemNotFoundException);
  });

  test("should throw DbException on get failure", async () => {
    mockQuery.mockRejectedValueOnce(new Error("connection lost"));
    await expect(repo.get("2001")).rejects.toThrow(DbException);
  });

  // GET ALL
  test("should get all books", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [book] });
    const result = await repo.getAll();
    expect(result.length).toBe(1);
    expect(result[0].getId()).toBe("2001");
  });

  // UPDATE
  test("should update a book successfully", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    await expect(repo.update(book)).resolves.not.toThrow();
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("UPDATE"), expect.any(Array));
  });

  test("should throw ItemNotFoundException when updating non-existing book", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });
    await expect(repo.update(book)).rejects.toThrow(ItemNotFoundException);
  });

  test("should throw DbException if update fails", async () => {
    mockQuery.mockRejectedValueOnce(new Error("update failed"));
    await expect(repo.update(book)).rejects.toThrow(DbException);
  });

  // DELETE
  test("should delete a book successfully", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    await expect(repo.delete("2001")).resolves.not.toThrow();
  });

  test("should throw ItemNotFoundException when deleting non-existing book", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });
    await expect(repo.delete("2001")).rejects.toThrow(ItemNotFoundException);
  });

  test("should throw DbException if delete fails", async () => {
    mockQuery.mockRejectedValueOnce(new Error("delete failed"));
    await expect(repo.delete("2001")).rejects.toThrow(DbException);
  });

});
