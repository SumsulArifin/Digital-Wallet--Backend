import { model, Schema } from "mongoose";
import { WalletStatus, IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  balance: { type: Number, default: 50 },
  currency: { type: String, default: "BDT" },
  walletStatus: {
    type: String,
    enum: Object.values(WalletStatus),
    default: WalletStatus.UNBLOCKED, // ✅ default status
  }
}, {
  timestamps: true,
  versionKey: false
});

export const Wallet = model<IWallet>("Wallet", walletSchema);
