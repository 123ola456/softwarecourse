import { Irepository, id, Intializable } from "../repository/Irepository";
import { IdentifiableBook } from "../model/book.model";
import { ConnectionManager } from "./ConnectionManager";
import { SQLiteBookMapper } from "../model/mapper/book.mapper";
import logger from "../utils/logger";
import { DbException, IntailizationException, ItemNotFoundException } from "../utils/Exceptions/repositoryExceptions";

const TABLE_NAME = "book";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT NOT NULL,
  pages INT NOT NULL,
  publisher TEXT NOT NULL,
  language TEXT NOT NULL,
  isbn TEXT NOT NULL
);
`;

const INSERT_BOOK = `
INSERT INTO ${TABLE_NAME} (
  id, title, author, genre, pages, publisher, language, isbn
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);
`;

const SELECT_BY_ID = `SELECT * FROM ${TABLE_NAME} WHERE id = $1`;
const SELECT_ALL = `SELECT * FROM ${TABLE_NAME}`;
const UPDATE_BOOK = `
UPDATE ${TABLE_NAME} SET
title=$1, author=$2, genre=$3, pages=$4, publisher=$5, language=$6, isbn=$7
WHERE id=$8
`;
const DELETE_ID = `DELETE FROM ${TABLE_NAME} WHERE id=$1`;
export class BookPgRepository implements Irepository<IdentifiableBook>, Intializable {

  private mapper = new SQLiteBookMapper();

  async init(): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      await client.query(CREATE_TABLE);
      logger.info("Table book initialized (PostgreSQL)");
    } catch (error: unknown) {
      logger.error("Failed to initialize book table", error as Error);
      throw new IntailizationException("Failed to initialize book table", error as Error);
      //finally always run wether there was an error or not,and here because we are taking a connection from the pool we need to release it 
    } finally {
      client?.release();
    }
  }
//take identifiableBook which is book(with its attributes) +id and insert into the table
  async create(item: IdentifiableBook): Promise<id> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      await client.query(INSERT_BOOK, [
       item.getTitle(),
        item.getAuthor(),
        item.getGenre(),
        item.getFormat(),
        item.getLanguage(),
        item.getPublisher(),
        item.getSpecialEdition(),
        item.getPackaging(),
        item.getId()
      ]);
      return item.getId();
    } catch (error: unknown) {
      logger.error("Failed to create book", error as Error);
      throw new DbException("Failed to create book", error as Error);
    } finally {
      client?.release();
    }
  }

  async get(id: id): Promise<IdentifiableBook> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(SELECT_BY_ID, [id]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Book with id ${id} not found`);
      return this.mapper.map(result.rows[0]);
    } catch (error: unknown) {
         if (error instanceof ItemNotFoundException) throw error; // preserve not-found error
      logger.error("Failed to get book of id %s %o", id, error as Error);
      throw new DbException(`Failed to get book of id ${id}`, error as Error);
    } finally {
      client?.release();
    }
  }

  async getAll(): Promise<IdentifiableBook[]> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(SELECT_ALL);
      return result.rows.map(row => this.mapper.map(row));
    } catch (error: unknown) {
      logger.error("Failed to get all books", error as Error);
      throw new DbException("Failed to get all books", error as Error);
    } finally {
      client?.release();
    }
  }

  async update(item: IdentifiableBook): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(UPDATE_BOOK, [
        item.getTitle(),
        item.getAuthor(),
        item.getGenre(),
        item.getFormat(),
        item.getLanguage(),
        item.getPublisher(),
        item.getSpecialEdition(),
        item.getPackaging(),
        item.getId()
      ]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Book with id ${item.getId()} not found`);
    } catch (error: unknown) {
         if (error instanceof ItemNotFoundException) throw error; // preserve not-found error
      logger.error("Failed to update book of id %s %o", item.getId(), error as Error);
      throw new DbException(`Failed to update book of id ${item.getId()}`, error as Error);
    } finally {
      client?.release();
    }
  }

  async delete(id: id): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(DELETE_ID, [id]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Book with id ${id} not found`);
    } catch (error: unknown) {
         if (error instanceof ItemNotFoundException) throw error; // preserve not-found error
      logger.error("Failed to delete book of id %s %o", id, error as Error);
      throw new DbException(`Failed to delete book of id ${id}`, error as Error);
    } finally {
      client?.release();
    }
  }
}
