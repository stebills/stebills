import { NextFunction, Response } from 'express';

const isAdmin = (req: any, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: true, message: 'Access denied, no authenticated user' });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ error: true, message: 'Invalid grant access, admin only' });
    return;
  }

  next();
};

export default isAdmin;
