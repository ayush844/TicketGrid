import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import {z as zod} from "zod";


export const validate = (schema: z.ZodType)=>(req: Request, res: Response, next: NextFunction)=>{
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: zod.treeifyError(result.error)
      });
    }

    req.body = result.data;

    next();
}