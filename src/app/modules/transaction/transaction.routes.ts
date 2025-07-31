import express from 'express';
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from './transaction.controller';

const router = express.Router();


router.post('/add-money', checkAuth(...Object.values(Role)), TransactionController.addMoney);
router.post('/cashOut-money', checkAuth(...Object.values(Role)), TransactionController.cash_out);
router.get('/transaction_history', checkAuth(...Object.values(Role)), TransactionController.getMyTransaction_History);
export const TransactionRoutes = router;
