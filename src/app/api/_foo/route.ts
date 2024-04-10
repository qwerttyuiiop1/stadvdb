import { NextRequest, NextResponse } from "next/server";
import { read, write } from "@connect";
export const GET = async (req: NextRequest) => {
  try {
	const res = await read(async conn => {
		return conn.sql('SELECT status as bar, apptid as id FROM appointments WHERE id="1"')
	}, "READ COMMITTED");
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
		await conn.query('UPDATE status SET statys = ? WHERE id = "1"', [bar])
		return conn.sql('SELECT status as bar, apptid as id FROM appointments WHERE id="1"')
	}, "REPEATABLE READ");
	return NextResponse.json(res[0]);
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}