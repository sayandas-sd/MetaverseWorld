import { Router } from "express";
import { UpdateMetadata } from "../../types";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";

export const userRouter = Router();


userRouter.post("/metadata", userMiddleware, async (req,res)=>{
    const parseData = UpdateMetadata.safeParse(req.body)
    if(!parseData.success) {
        res.status(411).json({
            message: "Validation Failed"
        })
        return
    }

    const updateAvatarId = await client.user.update({
        where: {
            id: req.userId
        },
        data:{
            avatarId: parseData.data.avatarId
        }
    })

    res.status(200).json({
        message: "Metadata updated",
        updateAvatarId
    })
})


userRouter.get("/metadata/bulk", async (req,res)=>{
    const usersIdString = (req.query.ids ?? "[]") as string;
    const usersId = (usersIdString).slice(1, usersIdString?.length - 2).split(",")

    const metadata = await client.user.findMany({
        where:{
            id:{
                in: usersId
            }
        }, select:{
            avatar: true,
            id: true
        }
    })

    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })
})