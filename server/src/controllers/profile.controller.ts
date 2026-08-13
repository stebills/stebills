import { Request, Response } from 'express';
import Profile from '../models/profile.model';
import User from '../models/user.model';
import catchAsync from '../utils/catchAsync';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { getPaginationParams, buildPaginationMeta } from '../utils/paginate';

class ProfileController {
  static getProfile = catchAsync(async (req: any, res: Response) => {
    const { _id } = req.user;

    const profile = await Profile.findOne({ user: _id })
      .lean()
      .sort({ createdAt: -1 })
      .populate('user', ['name', 'email', 'confirmed', 'blocked']);

    if (!profile) return sendError(res, 404, 'Profile not found');

    return sendSuccess(res, 200, 'Profile fetched successfully', profile);
  });

  static postProfile = catchAsync(async (req: Request, res: Response) => {
    const searchQuery = req.query.q as string | undefined;

    const searchCondition = searchQuery
      ? { email: { $regex: searchQuery, $options: 'i' } }
      : {};

    const { page, pageSize, skip } = getPaginationParams(req.query);

    const total = await Profile.countDocuments(searchCondition);

    const result = await User.find(searchCondition)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .select('-password')
      .lean();

    return res.status(200).json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      ...buildPaginationMeta(page, pageSize, skip, total),
      data: result,
    });
  });
}

export default ProfileController;
