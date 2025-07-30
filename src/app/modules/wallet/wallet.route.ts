import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

// PATCH /api/v1/wallet/update-status/:id
router.patch(
  "/update-status/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  WalletController.updateWalletStatus
);
router.get(
  "/getWallet/:userId",checkAuth(...Object.values(Role)),
  WalletController.getMyWallet
);
export const WalletRoutes = router;
