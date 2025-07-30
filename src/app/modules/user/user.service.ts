import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { Wallet } from "../wallet/wallet.model";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }


    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })
      if (user.role === Role.USER || user.role === Role.AGENT) {
        await Wallet.create({
            userId: user._id,
            balance: 50,
            currency: "BDT"
        });
    }

    return user

}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
        if (userId !== decodedToken.userId) {
            throw new AppError(401, "You are not authorized")
        }
    }

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if (decodedToken.role === Role.ADMIN && ifUserExist.role === Role.SUPER_ADMIN) {
        throw new AppError(401, "You are not authorized")
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}


const createAgent = async (userId: string,payload: Partial<IUser>, decodedToken: JwtPayload) => {
  const requesterRole = decodedToken.role;
  const requesterId = decodedToken.userId;

  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // ✅ Self-update restriction for USER or AGENT
  if ((requesterRole === Role.USER || requesterRole === Role.AGENT) && userId !== requesterId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  // ✅ ADMIN can't update SUPER_ADMIN
  if (requesterRole === Role.ADMIN && targetUser.role === Role.SUPER_ADMIN) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to modify a SUPER_ADMIN");
  }

  // ✅ Only Admins or above can update roles
  if (payload.role) {
    if (requesterRole !== Role.ADMIN && requesterRole !== Role.SUPER_ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "Only ADMINs can update roles");
    }

    if (payload.role === Role.SUPER_ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "Cannot assign SUPER_ADMIN role");
    }
  }

  // ✅ Basic field permission check (isActive, isDeleted, isVerified)
  if (payload.isActive !== undefined ||payload.isDeleted !== undefined ||payload.isVerified !== undefined) {
    if (requesterRole === Role.USER) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update status fields");
    }
  }

    // 🛡️ New: Restrict role change if not verified
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update roles");
    }

    if (!targetUser.isVerified) {
      throw new AppError(httpStatus.FORBIDDEN, "Cannot update role. User is not verified.");
    }
  }

  const updatedAgent = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedAgent;
};


const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query)
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};
const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
};
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};

export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe,
    createAgent
}