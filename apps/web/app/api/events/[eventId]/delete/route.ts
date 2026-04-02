import { callBackend } from "@/lib/protectedApi";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = await params;
    const data = await callBackend(
      `/events/${eventId}/delete`,
      {
        method: "PATCH",
      }
    );

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}