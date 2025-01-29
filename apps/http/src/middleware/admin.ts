import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) =>{

    const authholder = req.headers["authorization"];

    if (!authholder || !authholder.startsWith('Bearer ')) {
        res.status(403).json({
            message: "Wrong Input"
        })
        return
    }

    const token = authholder.split(' ')[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as {role: string, userId: string};

        if(decoded.role !== "Admin") {
                res.status(403).json({
                    message: "Unauthorized"
                })
                return
        }

        req.userId = decoded.userId;

        next();


    } catch(e) {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}