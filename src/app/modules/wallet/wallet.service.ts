
import httpStatus from "http-status";

import { Role } from "../user/user.interface";
import { Wallet } from "./wallet.model";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { WalletStatus } from "./wallet.interface";
import { Types } from "mongoose";

const updateWalletStatus = async (
  userId: string,
  walletStatus: WalletStatus,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role !== Role.ADMIN && decodedToken.role !== Role.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  // Use the helper function here:
  const wallet = await findWalletByUserId(userId);

  // Update status
  wallet.walletStatus = walletStatus;
  await wallet.save();

  return wallet;
};

const findWalletByUserId = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid userId");
  }

  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found for this user");
  }

  return wallet;
};


export const WalletService = {
  updateWalletStatus,
  findWalletByUserId
};
