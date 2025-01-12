import { Router } from "express"
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db/client";
import bcrypt from "bcrypt";

export const authRouter = Router();

authRouter.post("/signup", async (req, res)=>{

    const parseData = SignupSchema.safeParse(req.body)

    if (!parseData.success) {
        res.status(411).json({
            message: "validation failed"
        })
        return;
    }


    try {

        const userExits = await client.user.findUnique({
            where: {
                username: parseData.data.username
            }
        })

        if(userExits) {
            res.status(403).json({
                message: "email is already taken"
            })
            return;
        }

        const salt = 10;
        const hashPass = await bcrypt.hash(parseData.data.password, salt)

        const newUser = await client.user.create({
            data: {
                username: parseData.data.username,
                password: hashPass,
                role: parseData.data.role === "admin" ?  "Admin" : "User",
            }
        })

        res.status(200).json({
            userId: newUser.id,
        })
        
    }catch(e) {
        res.status(500).json({
            message: "server error"
        })
        return
    }
})

authRouter.post("/signin", async (req,res)=>{

    const parseData = SigninSchema.safeParse(req.body)

    if(!parseData.success) {
        res.status(411).json({
            message: "validation failed"
        })
        return 
    }

    try {

        const userExits = await client.user.findUnique({
            where: {
                username: parseData.data.username
            }
        })

        if(!userExits) {
            res.status(403).json({
                message: "User not found"
            })
        }

        const validPassword = bcrypt.compare(parseData.data.password, userExits.password)

        if(!validPassword) {
            res.status(403).json({
                message: "Incorrect credential"
            })
        }

    } catch(e) {
        res.status(500).json({
            message: "server error"
        })
        return
    }

})