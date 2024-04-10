import { NextRequest, NextResponse } from "next/server";
import { read, write } from "@connect";
export const GET = async (req: NextRequest) => {
  try {
	const res = await read(async conn => {
		return conn.sql('SELECT status, apptid FROM appointments WHERE apptid="1"')
	}, "READ COMMITTED");
	console.log('GET executed')
	return NextResponse.json(res[0]);
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}
export const PUT = async (req: NextRequest) => {
  try {
	const { bar } = await req.json();
	const res = await write(async conn => {
		await conn.query('UPDATE appointments SET status = ? WHERE apptid = "1"', [bar])
		await new Promise(resolve => setTimeout(resolve, 3000));
		const ret = await conn.sql('SELECT status, apptid FROM appointments WHERE apptid="1"');
		await conn.query('ROLLBACK;');
		return ret;
	}, "REPEATABLE READ");
	console.log('PUT executed')
	return NextResponse.json(res[0]);
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}