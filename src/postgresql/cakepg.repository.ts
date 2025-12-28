import { Irepository, id, Intializable } from "../repository/Irepository";
import { IdentifiableCake } from "../model/cake.model";
import { ConnectionManager } from "./ConnectionManager";
import { SQLiteCakeMapper } from "../model/mapper/cake.mapper";
import logger from "../utils/logger";
import { DbException, IntailizationException, ItemNotFoundException } from "../utils/Exceptions/repositoryExceptions";

const TABLE_NAME = "cake";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  flavor TEXT NOT NULL,
  filling TEXT NOT NULL,
  size INT NOT NULL,
  layers INT NOT NULL,
  frostingType TEXT NOT NULL,
  frostingFlavor TEXT NOT NULL,
  decorationType TEXT NOT NULL,
  decorationColor TEXT NOT NULL,
  customMessage TEXT NOT NULL,
  shape TEXT NOT NULL,
  allergies TEXT NOT NULL,
  specialIngredients TEXT NOT NULL,
  packagingType TEXT NOT NULL
);
`;

const INSERT_CAKE = `
INSERT INTO ${TABLE_NAME} (
  id, type, flavor, filling, size, layers,
  frostingType, frostingFlavor, decorationType, decorationColor,
  customMessage, shape, allergies, specialIngredients, packagingType
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);
`;

const SELECT_BY_ID = `SELECT * FROM ${TABLE_NAME} WHERE id = $1`;
const SELECT_ALL = `SELECT * FROM ${TABLE_NAME}`;
const UPDATE_CAKE = `
UPDATE ${TABLE_NAME} SET
type=$1, flavor=$2, filling=$3, size=$4, layers=$5,
frostingType=$6, frostingFlavor=$7, decorationType=$8, decorationColor=$9,
customMessage=$10, shape=$11, allergies=$12, specialIngredients=$13, packagingType=$14
WHERE id=$15
`;
const DELETE_ID = `DELETE FROM ${TABLE_NAME} WHERE id=$1`;

export class CakePgRepository implements Irepository<IdentifiableCake>, Intializable {

  private mapper = new SQLiteCakeMapper();

  async init(): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      await client.query(CREATE_TABLE);
      logger.info("Table cake initialized (PostgreSQL)");
    } catch (error: unknown) {
      logger.error("Failed to initialize cake table", error as Error);
      throw new IntailizationException("Failed to initialize cake table", error as Error);
    } finally {
      client?.release();
    }
  }

  async create(item: IdentifiableCake): Promise<id> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      await client.query("BEGIN"); // start transaction

      await client.query(INSERT_CAKE, [
        item.getId(),
        item.getType(),
        item.getFlavor(),
        item.getFilling(),
        item.getSize(),
        item.getLayers(),
        item.getFrostingType(),
        item.getFrostingFlavor(),
        item.getDecorationType(),
        item.getDecorationColor(),
        item.getCustomMessage(),
        item.getShape(),
        item.getAllergies(),
        item.getSpecialIngredients(),
        item.getPackagingType()
      ]);

      await client.query("COMMIT"); // commit transaction
      return item.getId();
    } catch (error: unknown) {
      if (client) await client.query("ROLLBACK"); // rollback on error
      logger.error("Failed to create cake", error as Error);
      throw new DbException("Failed to create cake", error as Error);
    } finally {
      client?.release();
    }
  }

  async get(id: id): Promise<IdentifiableCake> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(SELECT_BY_ID, [id]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Cake with id ${id} not found`);
      return this.mapper.map(result.rows[0]);
    } catch (error: unknown) {
      if (error instanceof ItemNotFoundException) throw error; // preserve not-found error
      logger.error("Failed to get cake of id %s %o", id, error as Error);
      throw new DbException(`Failed to get cake of id ${id}`, error as Error);
    } finally {
      client?.release();
    }
  }

  async getAll(): Promise<IdentifiableCake[]> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(SELECT_ALL);
      return result.rows.map(row => this.mapper.map(row));
    } catch (error: unknown) {
      logger.error("Failed to get all cakes", error as Error);
      throw new DbException("Failed to get all cakes", error as Error);
    } finally {
      client?.release();
    }
  }

  async update(item: IdentifiableCake): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(UPDATE_CAKE, [
        item.getType(),
        item.getFlavor(),
        item.getFilling(),
        item.getSize(),
        item.getLayers(),
        item.getFrostingType(),
        item.getFrostingFlavor(),
        item.getDecorationType(),
        item.getDecorationColor(),
        item.getCustomMessage(),
        item.getShape(),
        item.getAllergies(),
        item.getSpecialIngredients(),
        item.getPackagingType(),
        item.getId()
      ]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Cake with id ${item.getId()} not found`);
    } catch (error: unknown) {
      if (error instanceof ItemNotFoundException) throw error; // preserve not-found
      logger.error("Failed to update cake of id %s %o", item.getId(), error as Error);
      throw new DbException(`Failed to update cake of id ${item.getId()}`, error as Error);
    } finally {
      client?.release();
    }
  }

  async delete(id: id): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(DELETE_ID, [id]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Cake with id ${id} not found`);
    } catch (error: unknown) {
      if (error instanceof ItemNotFoundException) throw error; // preserve not-found
      logger.error("Failed to delete cake of id %s %o", id, error as Error);
      throw new DbException(`Failed to delete cake of id ${id}`, error as Error);
    } finally {
      client?.release();
    }
  }
}
