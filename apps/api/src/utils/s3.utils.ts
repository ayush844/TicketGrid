import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "../config/s3.js";


export const generateUploadUrl = async (eventId: string, fileType:string)=>{
    if(!fileType.startsWith("image/")){
        throw new Error("Invalid file type");
    }
    const extension = fileType.split("/")[1];
    const fileKey = `events/${eventId}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        ContentType: fileType,
    })

    const uploadUrl = await getSignedUrl(s3, command, {
        expiresIn: 60,
    })

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return {uploadUrl, fileUrl};
}