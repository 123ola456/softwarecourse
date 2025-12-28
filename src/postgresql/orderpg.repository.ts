import { IIdentifiableOrderItem } from "../model/Iorder";
import { id, Intializable, Irepository } from "../repository/Irepository";
import { IdentifiableOrderItem } from "../model/order.model";
import { IIdentifiableItem } from "../model/Iitem";
import { DbException, IntailizationException, ItemNotFoundException } from "../utils/Exceptions/repositoryExceptions";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../utils/logger";
import { SQLiteOrderMapper } from "../model/mapper/order.mapper";

const TABLE_NAME = "orders";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
  id TEXT PRIMARY KEY,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  item_category TEXT NOT NULL,
  item_id TEXT NOT NULL
);
`;

const INSERT_ORDER = `
INSERT INTO ${TABLE_NAME}(id, quantity, price, item_category, item_id)
VALUES($1,$2,$3,$4,$5);
`;

const SELECT_BY_ID = `SELECT * FROM ${TABLE_NAME} WHERE id=$1`;
const SELECT_ALL = `SELECT * FROM ${TABLE_NAME} WHERE item_category=$1`;
const UPDATE_ORDER = `
UPDATE ${TABLE_NAME} SET
quantity=$1, price=$2, item_category=$3, item_id=$4
WHERE id=$5
`;
const DELETE_ORDER = `DELETE FROM ${TABLE_NAME} WHERE id=$1`;

//IdentifiableOrderItem contain getPrice(),getQuantity(),getItem(),getId() methods +id
export class OrderPgRepository implements Irepository<IIdentifiableOrderItem>, Intializable {

  /* The constructor receives an itemRepository, which is the repository responsible
    for handling all CRUD operations for items (cake, toy, book). OrderRepository
     depends on it because every order contains an item, so before saving an order
     we must first save the item using this repository. We store it so we can call
     itemRepository.init(), itemRepository.create()...*/
  constructor(private readonly itemRepository: Irepository<IIdentifiableItem> & Intializable) {}

  async init(): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      await client.query(CREATE_TABLE);
      await this.itemRepository.init();
      logger.info("Table order initialized (PostgreSQL)");
    } catch (error: unknown) {
      logger.error("Failed to initialize order table", error as Error);
      throw new IntailizationException("Failed to initialize order table", error as Error);
    } finally {
      client?.release();
    }
  }

  async create(order: IIdentifiableOrderItem): Promise<id> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      /* Creates a new order inside a database transaction.
            First inserts the item and gets its generated ID,
            then inserts the order itself. If any step fails,
            the transaction is rolled back to keep data consistent.*/
      await client.query("BEGIN");
      const item_id = await this.itemRepository.create(order.getItem());
      await client.query(INSERT_ORDER, [
        order.getId(),
        order.getQuantity(),
        order.getPrice(),
        order.getItem().getCategory(),
        item_id
      ]);
      await client.query("COMMIT");
      return order.getId();
    } catch (error: unknown) {
      client && await client.query("ROLLBACK");
      logger.error("Failed to create order", error as Error);
      throw new DbException("Failed to create order", error as Error);
    } finally {
      client?.release();
    }
  }

  async get(id: id): Promise<IIdentifiableOrderItem> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const result = await client.query(SELECT_BY_ID, [id]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Order with id ${id} not found`);
      const item = await this.itemRepository.get(result.rows[0].item_id);
      return new SQLiteOrderMapper().map({ data: result.rows[0], item });
    } catch (error: unknown) {
         if (error instanceof ItemNotFoundException) throw error; // preserve not-found error
      logger.error("Failed to get order of id %s %o", id, error as Error);
      throw new DbException(`Failed to get order of id ${id}`, error as Error);
    } finally {
      client?.release();
    }
  }

  async getAll(): Promise<IIdentifiableOrderItem[]> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      const items = await this.itemRepository.getAll();
      if (items.length === 0) return [];
      const result = await client.query(SELECT_ALL, [items[0].getCategory()]);
      const bindedOrders = result.rows.map(order => {
        const item = items.find(i => i.getId() === order.item_id);
        if (!item) throw new Error("Item of id " + order.item_id + " not found");
        return { order, item };
      });
      return bindedOrders.map(({ order, item }) => new SQLiteOrderMapper().map({ data: order, item }));
    } catch (error: unknown) {
      logger.error("Failed to get all orders", error as Error);
      throw new DbException("Failed to get all orders", error as Error);
    } finally {
      client?.release();
    }
  }

  async update(order: IIdentifiableOrderItem): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      await client.query("BEGIN");
      await this.itemRepository.update(order.getItem());
      const result = await client.query(UPDATE_ORDER, [
        order.getQuantity(),
        order.getPrice(),
        order.getItem().getCategory(),
        order.getItem().getId(),
        order.getId()
      ]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Order with id ${order.getId()} not found`);
      await client.query("COMMIT");
    } catch (error: unknown) {
         if (error instanceof ItemNotFoundException) throw error; // preserve not-found error
      client && await client.query("ROLLBACK");
      logger.error("Failed to update order of id %s %o", order.getId(), error as Error);
      throw new DbException(`Failed to update order of id ${order.getId()}`, error as Error);
    } finally {
      client?.release();
    }
  }

  async delete(id: id): Promise<void> {
    let client;
    try {
      client = await ConnectionManager.getConnection();
      await client.query("BEGIN");
      await this.itemRepository.delete(id);
      const result = await client.query(DELETE_ORDER, [id]);
      if (result.rowCount === 0) throw new ItemNotFoundException(`Order with id ${id} not found`);
      await client.query("COMMIT");
    } catch (error: unknown) {
        
      client && await client.query("ROLLBACK");
       if (error instanceof ItemNotFoundException) throw error; // preserve not-found error
      logger.error("Failed to delete order of id %s %o", id, error as Error);
      throw new DbException(`Failed to delete order of id ${id}`, error as Error);
    } finally {
      client?.release();
    }
  }
}
