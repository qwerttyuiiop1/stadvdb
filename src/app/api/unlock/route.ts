import { NextResponse } from "next/server";
import { unlock } from "../lock/route";

export const GET = async () => {
  try {
  	await unlock();
  	return NextResponse.json({ success: true });
  } catch (e) {
	console.error(e);
	return NextResponse.json({ success: false });
  }
}
export const dynamic = "force-dynamic";