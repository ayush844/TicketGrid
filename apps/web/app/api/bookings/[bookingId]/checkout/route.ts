import { callBackend } from "@/lib/protectedApi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    const data = await callBackend(
      `/api/bookings/${bookingId}/checkout`,
      {
        method: "POST",
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