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