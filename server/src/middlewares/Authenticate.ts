import JwtHelper from '../utils/JwtHelper';
import { NextFunction, Request, Response } from 'express';
// import { IUserRequest } from "../../../../Billpoint-server/src/interfaces";
import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import User from '../models/user.model';
import UserService from '../services/user.service';

const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: true, message: 'Access denied, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: 'Access denied, no token provided' });
    }

    try {
      const decoded = JwtHelper.verifyToken(token) as JwtPayload;
      // Get user data
      const userId = decoded.userId;
      const user = await UserService.getUserById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      (req as any).user = user; // Attach the decoded user information to the request object
      next();
    } catch (error) {
      return res
        .status(400)
        .json({
          error: true,
          message: 'Invalid token or expired authentication token',
        });
    }
  } catch (err) {
    next(err);
  }
};

export default isAuth
