import { callBackend } from "@/lib/protectedApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = await params;

    const data = await callBackend(
      `/events/id/${eventId}`,
      {
        method: "GET"
      }
    );

    return Response.json(data);
  } catch (error: any) {

    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const body = await req.json();
    const { eventId } = await params;

    const data = await callBackend(
      `/events/${eventId}`,
      {
        method: "PUT",
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