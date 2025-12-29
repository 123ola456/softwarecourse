import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "../services/analytic.services";
import { OrderManagmentServices } from "../services/orderManagment.services";
import { BadRequestException } from "../utils/Exceptions/http/BadRequestException";

export class AnalyticsController {

  constructor(
    private readonly analyticsService: AnalyticsService
  ) {}

  // GET total orders
  public async getTotalOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const totalOrders = await this.analyticsService.getTotalOrders();
      res.status(200).json({ totalOrders });
    } catch (error) {
      next(error);
    }
  }

  // GET total revenue
  public async getTotalRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const totalRevenue = await this.analyticsService.getTotalRevenue();
      res.status(200).json({ totalRevenue });
    } catch (error) {
      next(error);
    }
  }

  // GET order count by category
  public async getOrderCountByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await this.analyticsService.getOrderCountByCategory();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET revenue by category
  public async getRevenueByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await this.analyticsService.getRevenueByCategory();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
