import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { elementRouter } from "./elements";
import { adminRouter } from "./admin"
import { avatarRouter } from "./avatar"
import { authRouter } from "./auth";

export const router = Router();

router.use("/auth", authRouter)
router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/elements", elementRouter)
router.use("/admin", adminRouter)
router.use("/avatars", avatarRouter)