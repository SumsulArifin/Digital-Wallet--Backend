import { Router } from "express";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";



const router = Router()



router.post("/register",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)
router.get("/all-wallet", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllwallets)
router.get("/all-transaction", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllTransaction)
router.patch("/createAgent/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.createAgnt);
export const UserRoutes = router