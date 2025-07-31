import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { TransactionService } from './transaction.service';
import { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

const addMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;

  const userId = decodedToken.userId; // assuming wallet uses ownerEmail
  console.log("---------------------------------",userId);
  
  const from = decodedToken.email;
  const role = decodedToken.role;

  const { to, amount,type } = req.body;

  if (decodedToken.email==to) {
    throw new Error('Your Cannot send ownn wallet');
  }

  if (!to || amount === undefined) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Missing required fields (to, amount)',
    });
    return; // <-- Prevent further execution
  }

  const result = await TransactionService.addMoneyService(
    userId,
    from,
    role,
    to,
    amount,
    type
    
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Money added successfully",
    data: result,
  });
});
const cash_out = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;

  const userId = decodedToken.userId; // assuming wallet uses ownerEmail
  console.log("---------------------------------",userId);
  const from = decodedToken.email;
  const role = decodedToken.role;
  const { to, amount,type } = req.body;


 if (type!== "cash_out") {
    throw new Error("Wrong transaction type selected");
  }
  if (decodedToken.email==to) {
    throw new Error('Your Cannot send ownn wallet');
  }
  if (!to || amount === undefined) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Missing required fields (to, amount)',
    });
    return; // <-- Prevent further execution
  }

  const result = await TransactionService.cashOut(
    userId,
    from,
    role,
    to,
    amount,
    type
    
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Money added successfully",
    data: result,
  });
});
const getMyTransaction_History = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await TransactionService.getMyTransaction_History(
      decodedToken.userId,
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your transaction history retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
export const TransactionController = {
  addMoney,
  cash_out,
  getMyTransaction_History
};







// import { Request, Response } from 'express';
// import httpStatus from 'http-status';
// import { TransactionService } from './transaction.service';
// import { JwtPayload } from 'jsonwebtoken';

// const addMoney = async (req: Request, res: Response) => {
//   try {
//     const decodedToken = req.user as JwtPayload;
//     const fromEmail = decodedToken.email;
//     const fromRole = decodedToken.role;
//     const { toEmail, amount } = req.body;

//     const result = await TransactionService.addMoneyService(fromEmail, fromRole, toEmail, amount);

//     res.status(httpStatus.OK).json({
//       success: true,
//       message: result.message,
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(httpStatus.BAD_REQUEST).json({
//       success: false,
//       message: error.message || 'Failed to add money',
//     });
//   }
// };
// export const TransactionController = {
// addMoney
// };