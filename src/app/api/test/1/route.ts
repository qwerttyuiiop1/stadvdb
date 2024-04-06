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
	const e1 = await execute(query, read(process.env.NODE_1_IP)).start();
	return NextResponse.json({test: e1});
  } catch (e) {
	return NextResponse.json(e, { status: 500 });
  }
}