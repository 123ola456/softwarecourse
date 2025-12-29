import { ItemCategory } from "../model/Iitem";
import { IIdentifiableOrderItem } from "../model/Iorder";
import { OrderManagmentServices } from "./orderManagment.services";

export class AnalyticsService {
  
  constructor(private orderService: OrderManagmentServices) {}

  // Total number of orders 
  public async getTotalOrders(): Promise<number> {
    const total = await this.orderService.getTotalOrders();
    return total || 0; // handle empty table
  }

  // Total revenue of all orders 

  public async getTotalRevenue(): Promise<number> {
    const totalRevenue = await this.orderService.getTotalRevenue();
    return totalRevenue || 0; // handle empty table
  }

 // Steps:
// 1. Get all category values from the ItemCategory enum (CAKE, TOY, BOOK).
// 2. For each category, get the correct repository (CakeRepo, ToyRepo, BookRepo).
// 3. Fetch all orders stored in that repo.
// 4. Filter the orders so we only count those that belong to the current category.
// 5. Store the count in an object where the key = category and the value = number of orders.
// Example output: { CAKE: 3, TOY: 1, BOOK: 0 }

  public async getOrderCountByCategory(): Promise<{ [key: string]: number }> {
    const categories = Object.values(ItemCategory);
    const counts: { [key: string]: number } = {};

    for (const category of categories) {
      const repo = await this.orderService["getRepo"](category); // access private getRepo
      const orders: IIdentifiableOrderItem[] = await repo.getAll();

      // Filter orders by current category
      const filteredOrders = orders.filter(o => o.getItem().getCategory() === category);
      counts[category] = filteredOrders.length;
    }

    return counts;
  }

  ///Revenue per category 
  public async getRevenueByCategory(): Promise<{ [key: string]: number }> {
    const categories = Object.values(ItemCategory);
    const revenueByCategory: { [key: string]: number } = {};

    for (const category of categories) {
      const repo = await this.orderService["getRepo"](category);
      const orders: IIdentifiableOrderItem[] = await repo.getAll();

      // Filter orders by current category
      const filteredOrders = orders.filter(o => o.getItem().getCategory() === category);

      let total = 0;
      for (const order of filteredOrders) {
        total += order.getPrice() * order.getQuantity();
      }
      revenueByCategory[category] = total;
    }

    return revenueByCategory;
  }
}
