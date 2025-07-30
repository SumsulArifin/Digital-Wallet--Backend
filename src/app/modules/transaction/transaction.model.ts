import { Schema, model } from "mongoose";
import { ITransaction, TransactionType, TransactionStatus } from "./transaction.interface";
import { Role } from "../user/user.interface";

const transactionSchema = new Schema<ITransaction>({
  walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
  type: {
    type: String,
    enum: Object.values(TransactionType),
    required: true,
  },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  initiatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  initiatorRole: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  senderWalletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
  receiverWalletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
  status: {
    type: String,
    enum: Object.values(TransactionStatus),
    default: TransactionStatus.PENDING,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
