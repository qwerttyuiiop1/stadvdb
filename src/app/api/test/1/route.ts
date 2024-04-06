import { NextRequest, NextResponse } from "next/server";
import { execute, readConnection as read } from "../db";

// test 1:
// Concurrent transactions in two or more nodes are reading the same data item.
export const GET = async (req: NextRequest) => {
  try {
	console.log('Executing test 1');
	const query = `
		START TRANSACTION;
		SELECT * FROM foo;
		COMMIT;
	`.split("\n").map(s => s.trim()).filter(s => s.length > 0);
	const ipis = [process.env.NODE_1_IP, process.env.NODE_2_IP, process.env.NODE_3_IP];
	const queries = ipis.map(ip => execute(query, read(ip)));
	const res = await Promise.all(queries.map(q=>q.start()));
	return NextResponse.json(res.map(r => r[1]));
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}