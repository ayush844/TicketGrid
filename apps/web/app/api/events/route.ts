import { callBackend } from "@/lib/protectedApi";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    try {

        const body = await req.json();
        const data = await callBackend("/events", {
            method: "POST",
            body
        })
        return Response.json(data);
    } catch (error: any) {
        if (error.message === "UNAUTHORIZED") {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
}