import express from 'express';
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from './transaction.controller';

const router = express.Router();


router.post('/add-money', checkAuth(...Object.values(Role)), TransactionController.addMoney);
router.post('/send-money', checkAuth(...Object.values(Role)), TransactionController.sendMoney);
router.post('/cashOut-money', checkAuth(...Object.values(Role)), TransactionController.cash_out);
router.post('/cashIn-money', checkAuth(...Object.values(Role)), TransactionController.cash_In);
router.get('/transaction_history', checkAuth(...Object.values(Role)), TransactionController.getMyTransaction_History);
export const TransactionRoutes = router;
