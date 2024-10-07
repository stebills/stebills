import { NextFunction, Request, Response } from 'express';

const isAdmin = (req: any, res: Response, next: NextFunction): void => {
  const { role } = req.user;
  try {
    if (req.user) {
      if (role === 'ADMIN') {
        next();
      } else {
        throw new Error('invalid grant access, admin only');
      }
    }
  } catch (err) {
    next(err);
  }
};

export default isAdmin;
