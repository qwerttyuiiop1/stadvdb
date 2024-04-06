import { NextResponse } from "next/server";
import { Connection, read } from "../connectionController";

// test 1:
// Concurrent transactions in two or more nodes are reading the same data item.
export const GET = async () => {
  try {
	const query = `
		START TRANSACTION;
		SELECT * FROM foo;
		COMMIT;
	`.split("\n");
	const handler = (conn: Connection) => conn.execute(query).start();
	const queries = [read(handler, 1), read(handler, 2), read(handler, 3)];
	const res = await Promise.all(queries);
	return NextResponse.json(res.map(r => r[1]));
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}