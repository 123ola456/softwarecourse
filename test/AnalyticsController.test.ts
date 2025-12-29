import { AnalyticsController } from "../src/controllers/analytics.controller";
import { AnalyticsService } from "../src/services/analytic.services";
import { Request, Response, NextFunction } from "express";

describe("AnalyticsController", () => {
    //we mock the service cause the controller depends on it
  let analyticsService: jest.Mocked<AnalyticsService>;
  let controller: AnalyticsController;
/*partial make all the properties of request and response optional,
because request contains a lot of fields that maybe we dont need all of them*/
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  //before each test mock analytics service functions
  beforeEach(() => {
    analyticsService = {
      getTotalOrders: jest.fn(),
      getTotalRevenue: jest.fn(),
      getOrderCountByCategory: jest.fn(),
      getRevenueByCategory: jest.fn(),
    } as unknown as jest.Mocked<AnalyticsService>;
   //dependency injection
    controller = new AnalyticsController(analyticsService);

    // partial request object,for now its empty later on will add proprties like req.body ..
    req = {};
    //res has methods(status and json) that are chainable
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    //next is used to test error handling or middleware behavior
    next = jest.fn();
  });


//total orders
  it("should return total orders successfully", async () => {
    //mockResolvedValue is a build in jest method used for mocking async functions that return a promise
    analyticsService.getTotalOrders.mockResolvedValue(10);

    await controller.getTotalOrders(req as Request, res as Response, next);

    expect(analyticsService.getTotalOrders).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ totalOrders: 10 });
  });

  it("should forward error when getTotalOrders fails", async () => {
    const error = new Error("Service error");
    analyticsService.getTotalOrders.mockRejectedValue(error);

    await controller.getTotalOrders(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });


  // getTotalRevenue
  it("should return total revenue successfully", async () => {
    analyticsService.getTotalRevenue.mockResolvedValue(500);

    await controller.getTotalRevenue(req as Request, res as Response, next);

    expect(analyticsService.getTotalRevenue).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ totalRevenue: 500 });
  });

  it("should forward error when getTotalRevenue fails", async () => {
    const error = new Error("Revenue error");
    analyticsService.getTotalRevenue.mockRejectedValue(error);

    await controller.getTotalRevenue(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });


  // getOrderCountByCategory
  it("should return order count by category", async () => {
    const mockResult = { CAKE: 2, TOY: 1, BOOK: 0 };
    analyticsService.getOrderCountByCategory.mockResolvedValue(mockResult);

    await controller.getOrderCountByCategory(req as Request, res as Response, next);

    expect(analyticsService.getOrderCountByCategory).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should forward error when getOrderCountByCategory fails", async () => {
    const error = new Error("Category error");
    analyticsService.getOrderCountByCategory.mockRejectedValue(error);

    await controller.getOrderCountByCategory(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // getRevenueByCategory
  it("should return revenue by category", async () => {
    const mockResult = { CAKE: 150, TOY: 30, BOOK: 0 };
    analyticsService.getRevenueByCategory.mockResolvedValue(mockResult);

    await controller.getRevenueByCategory(req as Request, res as Response, next);

    expect(analyticsService.getRevenueByCategory).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should forward error when getRevenueByCategory fails", async () => {
    const error = new Error("Revenue category error");
    analyticsService.getRevenueByCategory.mockRejectedValue(error);

    await controller.getRevenueByCategory(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
