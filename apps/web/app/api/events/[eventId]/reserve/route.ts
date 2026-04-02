import { callBackend } from "@/lib/protectedApi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const body = await req.json();
    const { eventId } = await params;

    const data = await callBackend(
      `/api/events/${eventId}/reserve`,
      {
        method: "POST",
        body,
      }
    );

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