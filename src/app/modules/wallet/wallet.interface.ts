import { Types } from "mongoose";
export enum WalletStatus {
  BLOCKED = "block",
  UNBLOCKED = "unblock",
}

export interface IWallet {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    balance: number;
    currency: string; 
    walletStatus: WalletStatus; 
}
