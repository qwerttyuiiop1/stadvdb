import { NextResponse } from "next/server";
import { admin } from "../connectionController"

export const GET = async () => {
  await admin(async conn => {
	conn.query("UNLOCK TABLES;");
  });
  return NextResponse.json({ success: true });
}