import { Request, Response } from 'express';
import StellarAccountService from '../services/stellarAccount.service';
import catchAsync from '../utils/catchAsync';
import { sendSuccess, sendError } from '../utils/apiResponse';

class StellarWalletController {
  static registerAccount = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const { publicKey, accountIndex, label, network } = req.body;

    if (!publicKey || accountIndex === undefined || !label) {
      return sendError(res, 400, 'Missing fields: publicKey, accountIndex and label required');
    }

    const account = await StellarAccountService.registerAccount(
      userId,
      publicKey,
      accountIndex,
      label,
      network
    );

    return sendSuccess(res, 201, 'Stellar account registered successfully', account);
  });

  static listAccounts = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;

    const accounts = await StellarAccountService.listAccountsForUser(userId);

    return sendSuccess(res, 200, 'Stellar accounts fetched successfully', accounts);
  });

  static renameAccount = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const { id } = req.params;
    const { label } = req.body;

    if (!label) {
      return sendError(res, 400, 'Missing field: label required');
    }

    const account = await StellarAccountService.renameAccount(userId, id, label);

    return sendSuccess(res, 200, 'Stellar account renamed successfully', account);
  });

  static deleteAccount = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const { id } = req.params;

    await StellarAccountService.deleteAccount(userId, id);

    return sendSuccess(res, 200, 'Stellar account removed successfully');
  });

  static nextAccountIndex = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;

    const nextIndex = await StellarAccountService.nextAccountIndex(userId);

    return sendSuccess(res, 200, 'Next account index fetched successfully', { nextIndex });
  });
}

export default StellarWalletController;
