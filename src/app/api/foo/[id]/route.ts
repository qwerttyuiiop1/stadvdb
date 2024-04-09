import { NextRequest, NextResponse } from "next/server";
import { read, write } from "@connect";
type Params = {
	params: {
		id: string
	}
}
export const GET = async (req: NextRequest, params: Params) => {
  try {
	const id = params.params.id;
	const res = await read(async conn => {
		const res = await conn.query<any>("SELECT * FROM foo WHERE id = ?", [id])
		return res[0][0];
	}, "READ COMMITTED");
	return NextResponse.json(res);
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}
export const PUT = async (req: NextRequest, params: Params) => {
  try {
	const id = params.params.id;
	const { bar } = await req.json();
	const res = await write(async conn => {
		await conn.query("UPDATE foo SET bar = ? WHERE id = ?", [bar, id])
		const res = await conn.query<any>("SELECT * FROM foo WHERE id = ?", [id])
		return res[0][0];
	}, "REPEATABLE READ");
	return NextResponse.json(res);
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}
export const DELETE = async (req: NextRequest, params: Params) => {
  try {
	const id = params.params.id;
	await write(async conn => {
		return conn.query("DELETE FROM foo WHERE id = ?", [id])
	}, "READ COMMITTED");
	return NextResponse.json({ success: true });
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}