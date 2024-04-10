import { NextRequest, NextResponse } from "next/server";
import { read, write } from "@connect";
export const GET = async (req: NextRequest) => {
  try {
	const res = await read(async conn => {
		return conn.sql('SELECT status, apptid FROM appointments WHERE apptid="1"')
	}, "READ COMMITTED");
	return NextResponse.json(res[0]);
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}
export const PUT = async (req: NextRequest) => {
  try {
	const { bar, sleep } = await req.json();
	const res = await write(async conn => {
		return await conn.query('UPDATE appointments SET status = ? WHERE apptid = "1"; SELECT status, apptid FROM appointments WHERE apptid="1";', [bar])
	}, "REPEATABLE READ");
	return NextResponse.json(res[0]);
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}