import { Types } from "mongoose";
import { Role } from "../user/user.interface";

export enum TransactionType {
  ADD_MONEY = "add_money",
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
  walletId: Types.ObjectId;           // Wallet impacted by transaction
  type: TransactionType;
  amount: number;
  fee?: number;
  commission?: number;
  initiatorId: Types.ObjectId;       // User or agent who initiated
  initiatorRole: Role;
  senderWalletId?: Types.ObjectId;   // For send_money
  receiverWalletId?: Types.ObjectId; // For send_money
  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
