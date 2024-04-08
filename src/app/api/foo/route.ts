import { NextRequest, NextResponse } from "next/server";
import { read, write } from "@connect";

export const GET = async () => {
  try {
	const res = await read(conn => {
		return conn.sql('SELECT * FROM foo;')
  	}, "READ COMMITTED");
	return NextResponse.json(res);
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}

export const POST = async (req: NextRequest) => {
  try {
	const { bar } = await req.json();
	const res = await write(async conn => {
		await conn.query("INSERT INTO foo (bar) VALUES (?)", [bar])
		const [res] = await conn.query(`SELECT * FROM foo WHERE bar = ?`, [bar])
		return res;
    }, "REPEATABLE READ");
	return NextResponse.json(res);
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}