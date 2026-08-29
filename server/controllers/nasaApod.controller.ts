import * as nasaApodService from "../services/nasaApod.service";
import { AppError } from "../lib/errors";
import { NextFunction, Request, Response } from "express";

export async function getAPOD(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const apod = await nasaApodService.fetchNasaAPOD();
    if(!apod) throw new AppError(500, "Failed to fetch APOD");
    res.status(200).json({
      success: true,
      apod});
  } catch (error) {
    next(error);
  }
}

export async function getNasaAPODRange(req: Request, res: Response, next: NextFunction) {
  try {
    const startDate =
      typeof req.query.startDate === "string" ? req.query.startDate : null;
    const endDate =
      typeof req.query.endDate === "string" ? req.query.endDate : null;

    if (!startDate || !endDate) {
      throw new AppError(400, "startDate and endDate are required");
    }

    const apod = await nasaApodService.fetchNasaAPODRange(startDate, endDate);
    if (!apod) throw new AppError(500, "Failed to fetch APOD range");

    res.status(200).json({
      success: true,
      apod,
    });
  } catch (error) {
    next(error);
  }
}