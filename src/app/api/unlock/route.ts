import { NextRequest, NextResponse } from "next/server";
import { admin } from "../connectionController"

export const GET = async (req: NextRequest) => {
  await admin(async conn => {
	conn.query("UNLOCK TABLES;");
  });
  return NextResponse.json({ success: true });
}
export const dynamic = "force-dynamic";