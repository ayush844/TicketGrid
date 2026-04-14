import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { hash, compare } from "bcryptjs";
import { publishEmail } from "../services/email.publisher.js";
import crypto from "crypto";



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

        publishEmail({
            type: "WELCOME",
            email: user.email,
            data: {
                email: user.email,
                role: user.role
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


export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
 
        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }
 
        const user = await prisma.user.findUnique({
            where: { email }
        });
 
        if (!user) {
            return res.json({ message: "If email exists, reset link sent" });
        }
 
        const token = crypto.randomBytes(32).toString("hex");
 
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
 
        const expires = new Date(Date.now() + 15 * 60 * 1000);
 
        await prisma.user.update({
            where: { email },
            data: {
                resetToken: hashedToken,
                resetTokenExp: expires
            }
        });
 
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
 
        publishEmail({
            type: "FORGOT_PASSWORD",
            email: user.email,
            data: { resetLink }
        });
 
        return res.json({ message: "Reset link sent" });
 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

 
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;
 
        if (!token || !password) {
            return res.status(400).json({ message: "Invalid request" });
        }
 
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
 
        const user = await prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExp: { gte: new Date() }
            }
        });
 
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
 
        const hashedPassword = await hash(password, 10);
 
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExp: null
            }
        });
 
        return res.json({ message: "Password reset successful" });
 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
 

