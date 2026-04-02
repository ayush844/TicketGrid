import { callBackend } from "@/lib/protectedApi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const data = await callBackend("/uploads/presigned-url", {
            method: "POST",
            body,
        });

        return NextResponse.json(data);
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