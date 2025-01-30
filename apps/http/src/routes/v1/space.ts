import { Router } from "express"
import { AddElementSchema, CreateElementSchema, CreateSchema, DeleteElementSchema } from "../../types";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";

export const spaceRouter = Router();


spaceRouter.post("/", userMiddleware, async (req,res)=>{
    const parseData = CreateSchema.safeParse(req.body);

    if (!parseData.success) {
        res.status(411).json({
            message: "Validation Failed"
        })
        return
    }

    //if user dont want a specific map then create a empty space

    if (!parseData.data.mapId) {
        await client.space.create({
            data: {
                name: parseData.data.name,
                width: parseData.data.dimensions.split("x")[0],
                height: parseData.data.dimensions.split("x")[1],
                adminId: req.userId as string,
            }
        })
    }

    //if user want a specific map

    const map = await client.map.findUnique({
        where:{
            id: parseData.data.mapId
        }, select:{
            mapElements: true,
            width: true,
            height: true
        }
    })

    if(!map) {
        res.status(403).json({
            message: "Map not found"
        })
        return
    }

    let newSpace = await client.$transaction(async ()=>{
        const space = await client.space.create({
            data: {
                name: parseData.data.name,
                width: map.width,
                height: map.height,
                adminId: req.userId as string,
            }
        });

        await client.spaceElement.createMany({
            data: map.mapElements.map(e => ({
                spaceId: space.id,
                elementId: e.elementId,
                x: e.x!,
                y: e.y!
            }))
        })

        return space;
    })

    res.json({
        sapceId: newSpace.id
    })
})

spaceRouter.delete("/:spaceId", userMiddleware, async (req,res)=> {
    
    const space = await client.space.findUnique({
        where:{
            id: req.params.spaceId
        }, select: {
            adminId: true
        }
    })
    
    if (!space) {
        res.status(400).json({
            message: "Space not found"
        })
        return
    }
    
    if (space?.adminId !== req.userId) {
        res.status(403).json({
            message: "Unauthorized"
        })
        return
    }
    
    await client.space.delete({
        where: {
            id: req.params.spaceId
        }
    })
    
    res.status(200).json({
        message: "Successfully deleted"
    })
})

spaceRouter.get("/all", userMiddleware, async (req,res) => {

    const allSpace = await client.space.findMany({
        where:{
            adminId: req.userId
        }
    })
    
    res.status(200).json({
        spaces: allSpace.map(e => ({
            is: e.id,
            name: e.name,
            thumbnail: e.thumbnail,
            dimensions: `${e.width}x${e.height}`
        }))
    })
})

spaceRouter.post("/element", userMiddleware, async (req,res)=>{

    const parseData = AddElementSchema.safeParse(req.body)

    if(!parseData.success) {
        res.status(403).json({
            message: "Validation Failed"
        })
        return
    }

    const space = await client.space.findUnique({
        where: {
            id: req.body.spaceId,
            adminId: req.userId!
        }, select: {
            width: true,
            height: true
        }
    })

    if(!space) {
        res.status(400).json({
            message: "Space not found"
        })
        return
    }

    await client.spaceElement.create({
        data: {
            spaceId: req.body.spaceId,
            elementId: req.body.elementId,
            x: req.body.x,
            y: req.body.y
        }
    })

    res.status(200).json({
        message: "Element added"
    })

})

spaceRouter.get("/:spaceId", async (req,res) => {

    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        }, include: {
            elements: {
                include: {
                    element: true
                }
            }
        }
    })

    if (!space) {
        res.status(400).json({
            message: "Space not found"
        })
        return
    }

    res.status(200).json({
        "dimensions": `${space.width}x${space.height}`,
        elements: space.elements.map(e => ({
            id: e.id,
            element: {
                id: e.element.id,
                width: e.element.width,
                height: e.element.height,
                imageUrl: e.element.imageUrl,
                static: e.element.static
            },
            x: e.x,
            y: e.y
        }))
    })

})

spaceRouter.delete("/element", userMiddleware, async (req,res)=>{
    const parseData = DeleteElementSchema.safeParse(req.body);

    if(!parseData.success) {
        res.status(403).json({
            message: "Validation Failed"
        })
        return
    }

    const spaceElement = await client.spaceElement.findFirst({
        where: {
            id: parseData.data.id,
        }, include: {
            space: true
        }
    })

    if (!spaceElement?.space.adminId || spaceElement.space.adminId !== req.userId) {
        res.status(400).json({
            message: "Space not found"
        })
        return
    }

    await client.spaceElement.delete({
        where: {
            id: req.body.id
        }
    })

    res.status(200).json({
        message: "Element deleted"
    })
})

