import { ServiceException } from "../utils/Exceptions/http/ServiceException";
import { generateUUID } from "../utils/index";
import { RepositoryFactory } from "../repository/repository.factory";
import config from "../config";
import { IIdentifiableOrderItem } from "../model/Iorder";
import { ItemCategory } from "../model/Iitem";
import { Irepository } from "../repository/Irepository";
import type { id } from "../repository/Irepository";
import { NotFoundException } from "../utils/Exceptions/http/NotfoundException";
import { BadRequestException } from "../utils/Exceptions/http/BadRequestException";

// This class handles business logic related to order management
export class OrderManagmentServices {

  /** Create an order */
  public async createOrder(order: IIdentifiableOrderItem): Promise<IIdentifiableOrderItem> {
    await this.ValidateOrder(order);

    // Generate and assign ID
    const id = generateUUID("order");
    // Assign a generated UUID to the order by dynamically overriding its getId method
    // Now order.getId() will return the unique ID before saving to the database
    order.getId = () => id;
    // Get the appropriate repository based on item category
    const repo = await this.getRepo(order.getItem().getCategory());
    // Save the order
    await repo.create(order);

    return order;
  }

  /** Get an order by ID */
  public async getOrder(id: id): Promise<IIdentifiableOrderItem> {
    //Object.values() is a built-in JavaScript function that returns all the values inside an object.
    //here ItemCATEGORY is an enum, so Object.values(ItemCategory) returns an array of all enum values
    const categories = Object.values(ItemCategory);

    for (const category of categories) {
      try{
      // For each category, get the corresponding repository and try to get the order by ID from that repo
      const repo = await this.getRepo(category);
      const order = await repo.get(id);
         return order;
    }
  catch(error){
    //ignore the error and continue to the next category
  }
}
throw  new NotFoundException("order with id${id} not found")
}

  /** Update an order */
  public async updateOrder(order: IIdentifiableOrderItem): Promise<void> {
    await this.ValidateOrder(order);
    const repo = await this.getRepo(order.getItem().getCategory());
    await repo.update(order);
  }

  /** Delete an order */
  public async deleteOrder(id: string): Promise<void> {
    const categories = Object.values(ItemCategory);

    for (const category of categories) {
      const repo = await this.getRepo(category);
      const order = await repo.get(id);

      if (order) {
        await repo.delete(id);
        return;
      }
    }

    throw new NotFoundException(`Order with id ${id} not found`);
  }

  /** Get all orders */
  public async getAllOrders(): Promise<IIdentifiableOrderItem[]> {
    const allOrders: IIdentifiableOrderItem[] = [];
    const categories = Object.values(ItemCategory);

    for (const category of categories) {
      const repo = await this.getRepo(category);
      const orders = await repo.getAll();
      allOrders.push(...orders);
    }

    return allOrders;
  }

  /** Get total revenue */
  public async getTotalRevenue(): Promise<number> {
    const orders = await this.getAllOrders();
// // reduce: loops through all orders and accumulates one final value (total revenue)
// starting from 0, it adds price * quantity for each order

    return orders.reduce(
      (sum, order) => sum + order.getPrice() * order.getQuantity(),
      0
    );
  }

  /** Get total orders count */
  public async getTotalOrders(): Promise<number> {
    const orders = await this.getAllOrders();
    //length: returns the number of orders in the array
    return orders.length;
  }

  //return the correct repository for a given item category (like Cake, Toy, Book) based on repository factory
  private async getRepo(category: ItemCategory): Promise<Irepository<IIdentifiableOrderItem>> {
    return RepositoryFactory.create(config.dbmode, category);
  }

  /** Validate an order */
  private async ValidateOrder(order: IIdentifiableOrderItem): Promise<void> {
    if (!order.getItem() || order.getQuantity() <= 0 || order.getPrice() <= 0) {
      const details={
        ItemNotDefined:!order.getItem(),
        PriceNegative:order.getPrice()<=0,
        QuantityNegative:order.getQuantity()<=0

      }
      throw new BadRequestException(
        "Invalid order: item must be non-null and quantity/price must be greater than 0",details
      );
    }
  }
}
