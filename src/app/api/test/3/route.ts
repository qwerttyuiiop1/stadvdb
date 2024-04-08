import { NextResponse } from "next/server";
import { IPS } from "@connect";

// test 2: Concurrent transactions in two or more nodes are writing (update / delete) the same data item.
export const GET = async () => {
  try {
	await fetch(`http://${IPS[0]}/api/foo/1`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ bar: "bar" })
	});
	const before = await fetch(`/api/test/1`).then(r => r.json());

	const queries = IPS.map(ip => fetch(`http://${ip}/api/foo/1`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ bar: ip })
	}).then(r => r.json()));
	await Promise.all(queries);
	
	const after = await fetch(`/api/test/1`).then(r => r.json());

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