import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";

export const adminRouter = Router();


adminRouter.post("/element", adminMiddleware, async (req,res)=>{
    
})

adminRouter.put("/element/:elementId", (req,res)=>{
    
})

adminRouter.post("/avatar", (req,res)=>{

})

adminRouter.post("/map", (req,res)=>{

})