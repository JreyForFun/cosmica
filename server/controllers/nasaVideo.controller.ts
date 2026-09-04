import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";
import { fetchNasaVideos } from "../services/nasaVideo.service";

export async function getNasaVideos(req: Request, res: Response, next: NextFunction) {
  try {
    const query = typeof req.query.query === "string" ? req.query.query : null;
    const page = typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
    const pageSize = typeof req.query.pageSize === "string" ? parseInt(req.query.pageSize, 10) : 10;

    if (!query) throw new AppError(400, "query is required");

    res.status(200).json({
      success: true,
      videos: await fetchNasaVideos(query, page, pageSize),
    });
  } catch (error) {
    next(error);
  }
}