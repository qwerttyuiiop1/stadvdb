import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
export const POST = async (req: NextRequest) => {
  try {
	const { query, server } = await req.json();
	const conn = await mysql.createConnection({
	  host: server, user: process.env.ADMIN_USER, password: process.env.ADMIN_PASSWORD
	});
	const [res] = await conn.query(query);
	conn.end();
	return NextResponse.json({ res });
  } catch (e) {
	console.error(e);
	return NextResponse.json({error: e});
  }
}