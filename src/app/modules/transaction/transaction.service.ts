import mongoose, { Types } from 'mongoose';
import { Wallet } from '../wallet/wallet.model';
import { Transaction } from './transaction.model';
import httpStatus from "http-status";
import AppError from '../../errorHelpers/AppError';
import { User } from '../user/user.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const addMoney = async (
  userId: string,
  from: string,
  Role: string,
  to: string,
  amount: number,
  transactionType:string
) => {
     if (transactionType!=="add_money") {
    throw new Error('Select worng transaction type');
  }
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const normalizedFromEmail = from.toLowerCase();
    const normalizedToEmail = to.toLowerCase();
    const toUser = await User.findOne({ email: normalizedToEmail }).session(session);
    if (!toUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Receiver user not found');
    }
    const fromWallet = await findWalletByUserId(userId, session);
    const toWallet = await Wallet.findOne({ userId: toUser._id }).session(session);
    if (fromWallet._id==toWallet?._id) {
      throw new Error('Your Cannot send ownn wallet');
    }
    if (!fromWallet){
      throw new Error('Sender wallet not found');
    } 
      
    if (!toWallet) {
      throw new Error('Receiver wallet not found');
    }

    if (fromWallet.walletStatus === 'block') {
      throw new Error('Your wallet is blocked. Cannot perform transactions');
    }
    if (toWallet.walletStatus === 'block') {
      throw new Error('Receiver wallet is blocked. Cannot perform transactions');
    }
    if (fromWallet.balance<amount) {
          throw new Error('Insufficient balance');
    }
    console.log("fromWallet.balance (before)", fromWallet.balance);
      fromWallet.balance -= amount;
      console.log("fromWallet.balance (after)", fromWallet.balance);
      await fromWallet.save({ session });


    toWallet.balance += amount;
    await toWallet.save({ session });

    await Transaction.create([
      {
        type: transactionType,
        amount,
        from: normalizedFromEmail,
        to: normalizedToEmail,
        status: 'completed',
        role: Role,
      },
    ], { session });

    await session.commitTransaction();
    session.endSession();

    return {
      message: 'Money added successfully',
      amount,
      from: normalizedFromEmail,
      to: normalizedToEmail,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

};

///
const sendMoney = async (
  userId: string,
  from: string,
  Role: string,
  to: string,
  amount: number,
  transactionType:string
) => {
     if (transactionType!=="send_money") {
    throw new Error('Select worng transaction type');
  }
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const normalizedFromEmail = from.toLowerCase();
    const normalizedToEmail = to.toLowerCase();
    const toUser = await User.findOne({ email: normalizedToEmail }).session(session);
    if (!toUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Receiver user not found');
    }
    const fromWallet = await findWalletByUserId(userId, session);
    const toWallet = await Wallet.findOne({ userId: toUser._id }).session(session);
    if (fromWallet._id==toWallet?._id) {
      throw new Error('Your Cannot send ownn wallet');
    }
    if (!fromWallet){
      throw new Error('Sender wallet not found');
    } 
      
    if (!toWallet) {
      throw new Error('Receiver wallet not found');
    }

    if (fromWallet.walletStatus === 'block') {
      throw new Error('Your wallet is blocked. Cannot perform transactions');
    }
    if (toWallet.walletStatus === 'block') {
      throw new Error('Receiver wallet is blocked. Cannot perform transactions');
    }
    if (fromWallet.balance<amount) {
          throw new Error('Insufficient balance');
    }
    console.log("fromWallet.balance (before)", fromWallet.balance);
      fromWallet.balance -= amount;
      console.log("fromWallet.balance (after)", fromWallet.balance);
      await fromWallet.save({ session });


    toWallet.balance += amount;
    await toWallet.save({ session });

    await Transaction.create([
      {
        type: transactionType,
        amount,
        from: normalizedFromEmail,
        to: normalizedToEmail,
        status: 'completed',
        role: Role,
      },
    ], { session });

    await session.commitTransaction();
    session.endSession();

    return {
      message: 'Money added successfully',
      amount,
      from: normalizedFromEmail,
      to: normalizedToEmail,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

};
//
const cashOut = async (
  userId: string,
  from: string,
  Role: string,
  to: string,
  amount: number,
  transactionType: string
) => {

  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const normalizedFromEmail = from.toLowerCase();
    const normalizedToEmail = to.toLowerCase();
    const toUser = await User.findOne({ email: normalizedToEmail }).session(session);
    if (!toUser) {
      throw new AppError(httpStatus.NOT_FOUND, "Receiver user not found");
    }
    if (toUser.role!=="AGENT") {

      throw new AppError(httpStatus.NOT_FOUND, "Receiver user not Agent");
    }

    const fromWallet = await findWalletByUserId(userId, session);
    const toWallet = await Wallet.findOne({ userId: toUser._id }).session(session);
    if (!fromWallet) throw new Error("Sender wallet not found");
    if (!toWallet) throw new Error("Receiver wallet not found");
    if (fromWallet._id.equals(toWallet._id)) {
      throw new Error("Cannot cash out to your own wallet");
    }
    if (fromWallet.walletStatus === "block") {
      throw new Error("Your wallet is blocked. Cannot perform transactions");
    }
    if (toWallet.walletStatus === "block") {
      throw new Error("Receiver wallet is blocked. Cannot perform transactions");
    }

    const fee = +(amount * 0.3).toFixed(2); // 3% commission
    const commission = +(fee * 0.5).toFixed(2);     // 50% of commission
    const totalDeduct = amount + fee;

    if (fromWallet.balance < totalDeduct) {
      throw new Error(`Insufficient balance. Required: ${totalDeduct}`);
    }

    fromWallet.balance -= totalDeduct;
    toWallet.balance += totalDeduct;

    await fromWallet.save({ session });
    await toWallet.save({ session });

    await Transaction.create(
      [
        {
          type: transactionType,
          amount,
          from: normalizedFromEmail,
          to: normalizedToEmail,
          commission,
          fee,
          totalDeduct,
          status: "completed",
          role: Role,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Cash out successful",
      amount,
      commission,
      fee,
      totalDeduct,

      from: normalizedFromEmail,
      to: normalizedToEmail,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cashIn = async (
  userId: string,
  from: string,
  Role: string,
  to: string,
  amount: number,
  transactionType: string
) => {

  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const normalizedFromEmail = from.toLowerCase();
    const normalizedToEmail = to.toLowerCase();
    const toUser = await User.findOne({ email: normalizedToEmail }).session(session);
    if (!toUser) {
      throw new AppError(httpStatus.NOT_FOUND, "Receiver user not found");
    }
     const fromWallet = await findWalletByUserId(userId, session);
    const toWallet = await Wallet.findOne({ userId: toUser._id }).session(session);
    if (!fromWallet) throw new Error("Sender wallet not found");
    if (!toWallet) throw new Error("Receiver wallet not found");
    if (fromWallet._id.equals(toWallet._id)) {
      throw new Error("Cannot cash out to your own wallet");
    }
    if (fromWallet.walletStatus === "block") {
      throw new Error("Your wallet is blocked. Cannot perform transactions");
    }
    if (toWallet.walletStatus === "block") {
      throw new Error("Receiver wallet is blocked. Cannot perform transactions");
    }

    const fee = +(amount * 0.3).toFixed(2); // 3% commission
    const commission = +(fee * 0.5).toFixed(2);     // 50% of commission
    const totalDeduct = amount + fee;

    if (fromWallet.balance < totalDeduct) {
      throw new Error(`Insufficient balance. Required: ${totalDeduct}`);
    }

    fromWallet.balance -= totalDeduct;
    toWallet.balance += totalDeduct;

    await fromWallet.save({ session });
    await toWallet.save({ session });

    await Transaction.create(
      [
        {
          type: transactionType,
          amount,
          from: normalizedFromEmail,
          to: normalizedToEmail,
          commission,
          fee,
          totalDeduct,
          status: "completed",
          role: Role,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Cash out successful",
      amount,
      commission,
      fee,
      totalDeduct,

      from: normalizedFromEmail,
      to: normalizedToEmail,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getMyTransaction_History = async (
  userId: string,
  query: Record<string, string>
) => {
  const user = await User.findById(userId);
  const email = user?.email;

  if (!email) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found or email missing");
  }

  const baseQuery = Transaction.find({ from: email });

  const transactionQuery = new QueryBuilder(baseQuery, query)
    .filter()
    .search(["type", "status"]) // fields you want to support search on
    .sort()
    .fields()
    .paginate()
    .build();

  const transactions = await transactionQuery;

  const meta = await new QueryBuilder(baseQuery, query).getMeta();

  return {
    data: transactions,
    meta,
  };
};
const findWalletByUserId = async (userId: string,session: mongoose.ClientSession) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid userId");
  }

    const wallet = await Wallet.findOne({ userId }).session(session);

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found for this user");
  }

  return wallet;
};


export const TransactionService = {
  addMoney,
  cashOut,
  getMyTransaction_History,
  sendMoney,
  cashIn
};