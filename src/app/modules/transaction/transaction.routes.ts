import express from 'express';
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from './transaction.controller';

const router = express.Router();


router.post('/add-money', checkAuth(...Object.values(Role)), TransactionController.addMoney);
export const TransactionRoutes = router;
