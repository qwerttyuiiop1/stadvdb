import { admin } from "@connect"
import { NextResponse } from "next/server";
type Params = {
	params: {
		sleep: string
	}
}
export const GET = async (a: any,{params: {sleep}}: Params) => {
  try {
	await admin(async conn => {
	  await conn.query("FLUSH TABLES WITH READ LOCK;");
	  await new Promise(resolve => setTimeout(resolve, Number(sleep) * 1000));
	  await conn.query("UNLOCK TABLES;");
	});
	return NextResponse.json({ success: true });
  } catch (e) {
	console.error(e);
	return NextResponse.json({ success: false });
  }
}