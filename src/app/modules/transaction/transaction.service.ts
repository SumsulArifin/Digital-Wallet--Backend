import mongoose, { Types } from 'mongoose';
import { Wallet } from '../wallet/wallet.model';
import { Transaction } from './transaction.model';
import httpStatus from "http-status";
import AppError from '../../errorHelpers/AppError';
import { User } from '../user/user.model';

const addMoneyService = async (
  userId: string,
  from: string,
  Role: string,
  to: string,
  amount: number
) => {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const normalizedFromEmail = from.toLowerCase();
    const normalizedToEmail = to.toLowerCase();
   
    

const fromWallet = await findWalletByUserId(userId, session);
    const toUser = await User.findOne({ email: normalizedToEmail }).session(session);
if (!toUser) {
  throw new AppError(httpStatus.NOT_FOUND, 'Receiver user not found');
}

// Get receiver wallet using userId
const toWallet = await Wallet.findOne({ userId: toUser._id }).session(session);
    


    if (!fromWallet) throw new Error('Sender wallet not found');
    if (!toWallet) throw new Error('Receiver wallet not found');

    if (fromWallet.walletStatus === 'block') {
      throw new Error('Your wallet is blocked. Cannot perform transactions');
    }

    if (Role === 'agent' && toWallet.walletStatus === 'block') {
      throw new Error('Cannot add money to a blocked user wallet');
    }
       if (Role === 'user' && toWallet.walletStatus === 'block') {
      throw new Error('Cannot add money to a blocked user wallet');
    }

    // if (Role === 'user' && fromWallet.balance < amount) {
    //   throw new Error('Insufficient balance');
    // }


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
        type: 'add_money',
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
  addMoneyService,
};










// import mongoose from 'mongoose';
// import { Wallet } from '../wallet/wallet.model';
// import { Transaction } from './transaction.model';

// const addMoneyService = async (
//   fromEmail: string,
//   fromRole: string,
//   toEmail: string,
//   amount: number
// ) => {
    
//   if (amount <= 0) throw new Error('Amount must be greater than 0');

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const fromWallet = await Wallet.findOne({ ownerEmail: fromEmail }).session(session);
//     console.log("----------------",fromWallet);
    
//     const toWallet = await Wallet.findOne({ ownerEmail: toEmail }).session(session);

//     if (!fromWallet) throw new Error('Sender wallet not found');
//     if (!toWallet) throw new Error('Receiver wallet not found');

//     if (fromWallet.walletStatus === 'block') {
//       throw new Error('Your wallet is blocked. Cannot perform transactions');
//     }

//     if (fromRole === 'agent' && toWallet.walletStatus === 'block') {
//       throw new Error('Cannot add money to a blocked user wallet');
//     }

//     if (fromRole === 'user' && fromWallet.balance < amount) {
//       throw new Error('Insufficient balance');
//     }

//     if (fromRole === 'user') {
//       fromWallet.balance -= amount;
//       await fromWallet.save({ session });
//     }

//     toWallet.balance += amount;
//     await toWallet.save({ session });

//     await Transaction.create(
//       [
//         {
//           type: 'add_money',
//           amount,
//           from: fromEmail,
//           to: toEmail,
//           status: 'completed',
//           role: fromRole,
//         },
//       ],
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     return {
//       message: 'Money added successfully',
//       amount,
//       from: fromEmail,
//       to: toEmail,
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };
// export const TransactionService = {
// addMoneyService
// };