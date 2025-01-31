import { Router } from "express";
import client from "@repo/db/client";

export const elementRouter = Router()

elementRouter.get("/", async (req, res)=>{
    const elements = await client.element.findMany({})
    
    res.status(200).json({
        allElements: elements
    })
})

