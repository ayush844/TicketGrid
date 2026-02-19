import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { hash } from "bcryptjs";




export const signup = async (req: Request, res: Response)=>{
    try {
        const {email, password, role} = req.body;

        if(!email || !password || !role){
            return res.status(400).json({
                message: "Email, password and role are required"
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role
            }
        });

        return res.status(201).json({
            message: "User created successfully",
            userId: user.id
        })


    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
        message: "Internal server error"
        });
    }
}