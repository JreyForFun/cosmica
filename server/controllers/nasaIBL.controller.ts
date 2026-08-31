import { fetchNasaIBL }  from "../services/nasaIBL.service";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";

export async function getNasaIBL(req: Request, res: Response, next: NextFunction) {
  try {
    const query = typeof req.query.query === "string" ? req.query.query : null;
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const pageSize = typeof req.query.pageSize === "string" ? parseInt(req.query.pageSize) : 10;

    if (!query) {
      throw new AppError(400, "query is required");
    }

    const images = await fetchNasaIBL(query, page, pageSize);
    if (!images) throw new AppError(500, "Failed to fetch images");

    res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    next(error);
  }
}