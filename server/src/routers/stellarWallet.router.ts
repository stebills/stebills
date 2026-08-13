import express from 'express';
import StellarWalletController from '../controllers/stellarWallet.controller';
import isAuth from '../middlewares/Authenticate';

const router = express.Router();

router.post('/wallet/accounts', isAuth, StellarWalletController.registerAccount);
router.get('/wallet/accounts', isAuth, StellarWalletController.listAccounts);
router.get('/wallet/accounts/next-index', isAuth, StellarWalletController.nextAccountIndex);
router.patch('/wallet/accounts/:id', isAuth, StellarWalletController.renameAccount);
router.delete('/wallet/accounts/:id', isAuth, StellarWalletController.deleteAccount);

export default router;
