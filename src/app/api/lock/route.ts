import { NextResponse } from "next/server";
import { lock } from "./lock";


export const GET = async () => {
  try {
  	await lock();
  	return NextResponse.json({ success: true });
  } catch (e) {
	console.error(e);
	return NextResponse.json({ success: false });
  }
}
export const dynamic = "force-static";