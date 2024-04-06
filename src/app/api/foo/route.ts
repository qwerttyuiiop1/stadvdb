import { NextRequest, NextResponse } from "next/server";
import { read, write } from "@connect";

export const GET = async () => {
  try {
	const res = await read(conn =>
		conn.sql("SELECT * FROM foo").start()
	)
	return NextResponse.json({ appointments: res });
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}

export const POST = async (req: NextRequest) => {
  try {
	const { bar } = await req.json();
	const res = await write(async conn => {
		conn.query("INSERT INTO foo (bar) VALUES (?)", [bar])
		return conn.sql("SELECT * FROM foo").start()
    })
	return NextResponse.json({ foo: res });
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}