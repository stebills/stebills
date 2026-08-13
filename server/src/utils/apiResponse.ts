import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown
) => {
  return res.status(statusCode).json({ error: false, message, data });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string
) => {
  return res.status(statusCode).json({ error: true, message });
};
