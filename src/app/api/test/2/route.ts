import { NextResponse } from "next/server";
import { IPS } from "@connect";

// test 2: At least one transaction in the three nodes is writing (update / delete) 
// and the other concurrent transactions are reading the same data item.
// assumption: all nodes are properly set-up and running
export const GET = async () => {
  console.log("test 2")
  try {
	await fetch(`http://localhost:80/api/foo/1`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ bar: "bar" })
	});
	const before = await fetch(`/api/test/1`).then(r => r.json());
	const queries = [] as any[];
	queries.push(fetch(`http://localhost:80/api/foo/1`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ bar: IPS[0] })
	}).then(r => r.json()))
	queries.concat(IPS.map(ip => fetch(`http://${ip}:80/api/foo/1`).then(r => r.json())));
	
	const data = await Promise.all(queries);
	return NextResponse.json({
		write: data.slice(0, 1),
		reads: data.slice(1),
		before: before
	});
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}
export const dynamic = "force-dynamic";