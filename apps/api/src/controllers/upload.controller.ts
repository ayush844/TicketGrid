import type { Request, Response } from "express";
import { generateUploadUrl } from "../utils/s3.utils.js";



export const getPresignUploadUrl = async (req: Request, res: Response) => {
    try {
        const {eventId, fileType} = req.body;

        if(!eventId || !fileType){
            return res.status(400).json({
                message: "Event and file type are required to upload image"
            })
        };

        const {uploadUrl, fileUrl} = await generateUploadUrl(eventId, fileType);

        return res.json({
            uploadUrl,
            fileUrl
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}