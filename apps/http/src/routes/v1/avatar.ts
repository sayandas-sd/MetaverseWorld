import { Router } from "express";
import client from "@repo/db/client";

export const avatarRouter = Router();

avatarRouter.get("/", async (req,res)=>{
    const avatars = await client.avatar.findMany({})

    res.status(200).json({
        avatars
    })
    
    return 
})