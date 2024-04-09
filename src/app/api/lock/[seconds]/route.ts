import { admin } from "@connect"
import { NextResponse } from "next/server";
type Params = {
	params: {
		seconds: string
	}
}
export const GET = async (a: any,{params: {seconds}}: Params) => {
  try {
	await admin(async conn => {
	  await conn.query("FLUSH TABLES WITH READ LOCK;");
	  await new Promise(resolve => setTimeout(resolve, Number(seconds) * 1000));
	  await conn.query("UNLOCK TABLES;");
	});
	return NextResponse.json({ success: true });
  } catch (e) {
	console.error(e);
	return NextResponse.json({ success: false });
  }
}