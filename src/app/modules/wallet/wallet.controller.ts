import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { WalletService } from "./wallet.service";
import { Role } from "../user/user.interface";


const updateWalletStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // userId
    const { walletStatus } = req.body;
    const verifiedToken = req.user as JwtPayload;

    if (!["block", "unblock"].includes(walletStatus)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid wallet status");
    }

    const updatedUser = await WalletService.updateWalletStatus(id, walletStatus, verifiedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wallet status updated successfully",
      data: updatedUser,
    });
  }
);
const getMyWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
 const requestedUserId = req.params.userId;
    // if (decodedToken.role !== Role.USER) {
    //   throw new AppError(httpStatus.FORBIDDEN, "Only users can access their wallets");
    // }
    if (decodedToken.userId !== requestedUserId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to access this wallet");
    }
    const wallet = await WalletService.findWalletByUserId(requestedUserId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wallet fetched successfully",
      data: wallet,
    });
  }
);
export const WalletController = {
  updateWalletStatus,
  getMyWallet
};