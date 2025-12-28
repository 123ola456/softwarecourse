import { Irepository, id, Intializable } from "../repository/Irepository";
import { IdentifiableToy } from "../model/toy.model";
import { ConnectionManager } from "./ConnectionManager";
import { SQLiteToyMapper } from "../model/mapper/toy.mapper";
import logger from "../utils/logger";
import { DbException, IntailizationException, ItemNotFoundException } from "../utils/Exceptions/repositoryExceptions";

const TABLE_NAME = "toy";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  ageGroup TEXT NOT NULL,
  brand TEXT NOT NULL,
  material TEXT NOT NULL,
  batteryRequired BOOLEAN NOT NULL,
 educational BOOLEAN NOT NULL
);
`;

const INSERT_TOY = `
INSERT INTO ${TABLE_NAME} (
  id, type, ageGroup, brand, material, batteryRequired, educational
) VALUES ($1,$2,$3,$4,$5,$6,$7);
`;

const SELECT_BY_ID = `SELECT * FROM ${TABLE_NAME} WHERE id = $1`;
const SELECT_ALL = `SELECT * FROM ${TABLE_NAME}`;
const UPDATE_TOY = `
UPDATE ${TABLE_NAME} SET
type=$1, ageGroup=$2, brand=$3, material=$4, batteryRequired=$5, educational=$6
WHERE id=$7
`;
const DELETE_ID = `DELETE FROM ${TABLE_NAME} WHERE id=$1`;

export class ToyPgRepository implements Irepository<IdentifiableToy>, Intializable {

  private mapper = new SQLiteToyMapper();

  async init(): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      await client.query(CREATE_TABLE);
      logger.info("Table toy initialized (PostgreSQL)");
    } catch (error: unknown) {
      logger.error("Failed to initialize toy table", error as Error);
      throw new IntailizationException("Failed to initialize toy table", error as Error);
    } finally {
      client?.release();
    }
  }

  async create(item: IdentifiableToy): Promise<id> {
  let client;
  try {
    client = await ConnectionManager.getConnection();

    // 💡 REQUIRED FOR TEST
    await client.query("BEGIN");

    await client.query(INSERT_TOY, [
      item.getId(),
      item.getType(),
      item.getAgeGroup(),
      item.getBrand(),
      item.getMaterial(),
      item.isBatteryRequired(),
      item.isEducational()
    ]);

    await client.query("COMMIT");
    return item.getId();

  } catch (error: unknown) {

    if (client) {
      await client.query("ROLLBACK");   
    }

    logger.error("Failed to create toy", error as Error);
    throw new DbException("Failed to create toy", error as Error);

  } finally {
    client?.release();
  }
}


  async get(id: id): Promise<IdentifiableToy> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(SELECT_BY_ID, [id]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Toy with id ${id} not found`);
      return this.mapper.map(result.rows[0]);
    } catch (error: unknown) {
         if (error instanceof ItemNotFoundException) throw error; // preserve not-found error
      logger.error("Failed to get toy of id %s %o", id, error as Error);
      throw new DbException(`Failed to get toy of id ${id}`, error as Error);
    } finally {
      client?.release();
    }
  }

  async getAll(): Promise<IdentifiableToy[]> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(SELECT_ALL);
      return result.rows.map(row => this.mapper.map(row));
    } catch (error: unknown) {
      logger.error("Failed to get all toys", error as Error);
      throw new DbException("Failed to get all toys", error as Error);
    } finally {
      client?.release();
    }
  }

  async update(item: IdentifiableToy): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(UPDATE_TOY, [
        item.getType(),
        item.getAgeGroup(),
        item.getBrand(),
        item.getMaterial(),
        item.isBatteryRequired(),
        item.isEducational(),
        item.getId()
      ]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Toy with id ${item.getId()} not found`);
    } catch (error: unknown) {
         if (error instanceof ItemNotFoundException) throw error; // preserve not-found error
      logger.error("Failed to update toy of id %s %o", item.getId(), error as Error);
      throw new DbException(`Failed to update toy of id ${item.getId()}`, error as Error);
    } finally {
      client?.release();
    }
  }

  async delete(id: id): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(DELETE_ID, [id]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Toy with id ${id} not found`);
    } catch (error: unknown) {
         if (error instanceof ItemNotFoundException) throw error; // preserve not-found error
      logger.error("Failed to delete toy of id %s %o", id, error as Error);
      throw new DbException(`Failed to delete toy of id ${id}`, error as Error);
    } finally {
      client?.release();
    }
  }
}
