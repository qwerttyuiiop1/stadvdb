import { NextResponse } from "next/server";
import { execute, readConnection as read } from "../db";

// test 2:
// At least one transaction in the three nodes is writing (update / delete) 
// and the other concurrent transactions are reading the same data item.
export const GET = async () => {
  try {
	console.log('Executing test 2');
	const query = `
		START TRANSACTION;
		UPDATE foo SET bar = bar * 2 WHERE id = 1;
		COMMIT;
		SELECT * FROM foo;
	`.split("\n");
	const ipis = [process.env.NODE_1_IP, process.env.NODE_2_IP, process.env.NODE_3_IP];
	const queries = ipis.map(ip => execute(query, read(ip)));
	const res = await Promise.all(queries.map(q=>q.start()));
	return NextResponse.json(res.map(r => r[2]));
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}