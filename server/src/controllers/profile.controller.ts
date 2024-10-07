import { Response, Request, NextFunction } from 'express';
import Profile from '../models/profile.model';
import User from '../models/user.model';

class ProfileController {
  static async getProfile(req: any, res: Response): Promise<void> {
    try {
      const { _id } = req.user;

      const profile = await Profile.findOne({ user: _id })
        .lean()
        .sort({ createdAt: -1 })
        .populate('user', ['name', 'email', 'confirmed', 'blocked']);

      res.status(200).send(profile);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async postProfile(req: Request, res: Response): Promise<void> {
    try {
      const searchQuery = req.query.q as string | undefined;

      const searchCondition = searchQuery
        ? { email: { $regex: searchQuery, $options: 'i' } }
        : {};

      const page = Math.max(parseInt(req.query.page as string) || 1, 1);
      const pageSize = Math.min(parseInt(req.query.limit as string) || 25, 100);
      const skip = (page - 1) * pageSize;

      const total = await Profile.countDocuments(searchCondition);

      const pages = Math.ceil(total / pageSize);

      const usersQuery = User.find(searchCondition)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .select('-password')
        .lean(); // Return plain JS objects

      const result = await usersQuery;

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default ProfileController;
