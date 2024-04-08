import { NextResponse } from "next/server";
import { IPS } from "@connect";

// test 2: Concurrent transactions in two or more nodes are writing (update / delete) the same data item.
export const GET = async () => {
  console.log("test 3")
  try {
	await fetch(`http://localhost:80/api/foo/1`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ bar: "bar" })
	});
	const before = await fetch(`http://localhost:80/api/test/1`).then(r => r.json());

	const queries = IPS.map(ip => fetch(`http://${ip}:80/api/foo/1`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ bar: ip })
	}).then(r => r.json()));
	await Promise.all(queries);
	
	const after = await fetch(`http://localhost:80/api/test/1`).then(r => r.json());

	return NextResponse.json({
		before,
		after
	});
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}
export const dynamic = "force-dynamic";