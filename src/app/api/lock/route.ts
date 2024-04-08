import { NextRequest, NextResponse } from "next/server";
import { admin } from "../connectionController"

export const GET = async (req: NextRequest) => {
  await admin(async conn => {
	conn.query("FLUSH TABLES WITH READ LOCK;");
  });
  return NextResponse.json({ success: true });
}