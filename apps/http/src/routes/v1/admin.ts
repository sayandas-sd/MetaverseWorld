import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../../types";
import client from "@repo/db/client";

export const adminRouter = Router();


adminRouter.post("/element", adminMiddleware, async (req,res)=>{
    const parseData = CreateElementSchema.safeParse(req.body);

    if(!parseData.success) {
        res.status(403).json({
            message: "Validation Failed"
        })
        return
    }

    const element = await client.element.create({
        data: {
            width: parseData.data.width,
            height: parseData.data.height,
            imageUrl: parseData.data.imageUrl,
            static: parseData.data.static
        }
    })

    res.json({
        message: "Element created",
        elementId: element.id
    })
})


adminRouter.put("/element/:elementId", async (req,res)=>{
    const parseData = UpdateElementSchema.safeParse(req.body);

    if(!parseData.success) {
        res.status(403).json({
            message: "Validation Failed"
        })
        return
    }


    await client.element.update({
        where: {
            id: req.params.elementId
        }, 
        data: {
            imageUrl: parseData.data.imageUrl
        }
    })

    res.status(200).json({
        message: "Successfully update element"
    })
})

adminRouter.post("/avatar", async (req,res)=>{
    const parseData = CreateAvatarSchema.safeParse(req.body);

    if(!parseData.success) {
        res.status(403).json({
            message: "Validation Failed"
        })
        return
    }

    const avatarID = await client.avatar.create({
        data: {
            name: parseData.data.name,
            imageUrl: parseData.data.imageUrl
        }
    })

    res.status(200).json({
        message: "Successfully created avatar",
        id: avatarID.id
    })
})

adminRouter.post("/map", async (req,res)=>{
        const parseData = CreateMapSchema.safeParse(req.body)

        if(!parseData.success) {
            res.status(403).json({
                message: "Validation Failed"
            })
            return
        }

        const map = await client.map.create({
            data: {
                name: parseData.data.name,
                thumbnail: parseData.data.thumbnail,
                width: parseInt(parseData.data.dimensions.split("x")[0]),
                height: parseInt(parseData.data.dimensions.split("x")[1]),
                mapElements: {
                    create: parseData.data.defaultElements.map(e => ({
                        elementId: e.elementId,
                        x: e.x,
                        y: e.y
                    }))
                }
            }
        })

        res.status(200).json({
            message: "Successfully created map",
            mapId: map.id
        })
})