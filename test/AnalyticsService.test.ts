import { AnalyticsService } from "../src/services/analytic.services";
import { OrderManagmentServices } from "../src/services/orderManagment.services";
import { ItemCategory } from "../src/model/Iitem";
import { IIdentifiableOrderItem } from "../src/model/Iorder";

// Mock orders
const mockOrders: IIdentifiableOrderItem[] = [
  {
    getItem: () => ({ getCategory: () => ItemCategory.CAKE, getId: () => "item1" }),
    getPrice: () => 50,
    getQuantity: () => 2,
    getId: () => "order1"
  },
  {
    getItem: () => ({ getCategory: () => ItemCategory.TOY, getId: () => "item2" }),
    getPrice: () => 30,
    getQuantity: () => 1,
    getId: () => "order2"
  },
  {
    getItem: () => ({ getCategory: () => ItemCategory.CAKE, getId: () => "item3" }),
    getPrice: () => 20,
    getQuantity: () => 3,
    getId: () => "order3"
  }
];

describe("AnalyticsService with mocked repos", () => {
  let mockOrderService: jest.Mocked<OrderManagmentServices>;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    // Repo already represents a SINGLE category table
    const mockRepo = {
      getAll: jest.fn().mockResolvedValue(mockOrders)
    };

    mockOrderService = {
      getTotalOrders: jest.fn().mockResolvedValue(mockOrders.length),
      getTotalRevenue: jest.fn().mockResolvedValue(
        mockOrders.reduce((sum, o) => sum + o.getPrice() * o.getQuantity(), 0)
      ),
      ["getRepo"]: jest.fn().mockResolvedValue(mockRepo)
    } as unknown as jest.Mocked<OrderManagmentServices>;

    analyticsService = new AnalyticsService(mockOrderService);
  });

  it("should return total orders", async () => {
    const totalOrders = await analyticsService.getTotalOrders();
    expect(totalOrders).toBe(3);
    expect(mockOrderService.getTotalOrders).toHaveBeenCalled();
  });

  it("should return total revenue", async () => {
    const totalRevenue = await analyticsService.getTotalRevenue();
    expect(totalRevenue).toBe(50 * 2 + 30 * 1 + 20 * 3);
    expect(mockOrderService.getTotalRevenue).toHaveBeenCalled();
  });

  it("should return order count by category", async () => {
    const counts = await analyticsService.getOrderCountByCategory();

    expect(counts[ItemCategory.CAKE]).toBe(2);
    expect(counts[ItemCategory.TOY]).toBe(1);
    expect(counts[ItemCategory.BOOK]).toBe(0);
  });

  it("should return revenue by category", async () => {
    const revenue = await analyticsService.getRevenueByCategory();

    expect(revenue[ItemCategory.CAKE]).toBe(50 * 2 + 20 * 3);
    expect(revenue[ItemCategory.TOY]).toBe(30);
    expect(revenue[ItemCategory.BOOK]).toBe(0);
  });

  it("should handle empty tables", async () => {
    (mockOrderService["getRepo"] as jest.Mock).mockResolvedValue({
      getAll: jest.fn().mockResolvedValue([])
    });

    const counts = await analyticsService.getOrderCountByCategory();
    const revenue = await analyticsService.getRevenueByCategory();

    expect(counts[ItemCategory.CAKE]).toBe(0);
    expect(counts[ItemCategory.TOY]).toBe(0);
    expect(counts[ItemCategory.BOOK]).toBe(0);

    expect(revenue[ItemCategory.CAKE]).toBe(0);
    expect(revenue[ItemCategory.TOY]).toBe(0);
    expect(revenue[ItemCategory.BOOK]).toBe(0);
  });
});
