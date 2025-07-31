import { Schema, model } from "mongoose";
import { ITransaction, TransactionType, TransactionStatus } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    from: {
      type: String, 
      required: true,
    },
    to: {
      type: String, 
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const Transaction = model<ITransaction>("Transaction", transactionSchema);
