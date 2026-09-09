import { NextRequest, NextResponse } from "next/server";
import { getKeyLiveState } from "@/types/serverStore";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ keySlot: string }> }
) {
  try {
    const { keySlot } = await context.params;
    if (!keySlot) {
      return NextResponse.json(
        { error: "Key slot is required" },
        { status: 400 }
      );
    }

    const state = getKeyLiveState(keySlot);

    return NextResponse.json(
      {
        success: true,
        data: state,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch key live state" },
      { status: 500 }
    );
  }
}
