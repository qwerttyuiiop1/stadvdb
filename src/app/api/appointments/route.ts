import { NextResponse } from "next/server";
import { read } from "../connectionController";

export const GET = async () => {
  try {
	const res = await read(async conn =>
		conn.sql("SELECT * FROM appointments").start()
	)
	return NextResponse.json({ appointments: res });
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}