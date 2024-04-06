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
	`.split("\n");
	const e1 = execute(query, read(process.env.NODE_1_IP));
	const e2 = execute(query, read(process.env.NODE_2_IP));
	const e3 = execute(query, read(process.env.NODE_3_IP));
	const res = await Promise.all([e1.start(), e2.start(), e3.start()]);
	return NextResponse.json(res);
  } catch (e) {
	return NextResponse.json(e, { status: 500 });
  }
}