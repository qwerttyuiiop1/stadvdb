import { NextRequest, NextResponse } from "next/server";
import { read, write } from "@connect";

export const GET = async () => {
  try {
	const res = await read(conn =>
		conn.sql(`
		START TRANSACTION;
		SELECT * FROM foo;
		COMMIT;
		`.split("\n"), 1)
	)
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
		await conn.beginTransaction()
		await conn.query("INSERT INTO foo (bar) VALUES (?)", [bar])
		const [res] = await conn.query(`SELECT * FROM foo WHERE bar = ?`, [bar])
		await conn.commit()
		return res;
    })
	return NextResponse.json(res);
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}