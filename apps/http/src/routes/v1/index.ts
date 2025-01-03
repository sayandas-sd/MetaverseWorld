import { Router } from "express";
import { userRouter } from "./user";

export const router = Router();


router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/elements", elementRouter)
router.use("/admin", adminRouter)
router.use("/avatars", avatarRouter)