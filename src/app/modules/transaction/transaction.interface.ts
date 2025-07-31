import { Types } from "mongoose";

export enum TransactionType {
  ADD_MONEY = "add_money",
  CASH_OUT="cash_out",
  WITHDRAW = "withdraw",
  SEND_MONEY = "send_money",
  RECEIVE_MONEY = "receive_money",
  COMMISSION = "commission",
  FEE = "fee",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  REVERSED = "reversed",
  FAILED = "failed",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  from:string;
  to:string;
  type: TransactionType;
  amount: number;
  fee?: number;
  commission?: number;
  status: TransactionStatus;
}
