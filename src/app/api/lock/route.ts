import { NextRequest, NextResponse } from "next/server";
import { ScopedConnection, admin, scope } from "../connectionController"
const adminScope = scope(admin);

let conn: ScopedConnection | null = null;
const lock = async () => {
	if (conn) return;
	conn = await adminScope();
	conn.query("FLUSH TABLES WITH READ LOCK;");
}
export const unlock = async () => {
	if (!conn) return;
	conn.query("UNLOCK TABLES;");
	conn.endScope();
	conn = null;
}

export const GET = async () => {
  try {
  	await lock();
  	return NextResponse.json({ success: true });
  } catch (e) {
	console.error(e);
	return NextResponse.json({ success: false });
  }
}
export const dynamic = "force-dynamic";