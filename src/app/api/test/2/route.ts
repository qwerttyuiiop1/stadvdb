import { NextResponse } from "next/server";
import { IPS } from "@connect";

const desc = `
test 2: At least one transaction in the three nodes is writing (update / delete) 
and the other concurrent transactions are reading the same data item.
assumption: all nodes are properly set-up, running, and not locked
`
export const GET = async () => {
  try {
	await fetch(`http://localhost:80/api/test`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ bar: "bar" })
	});
	const before = await fetch(`http://localhost:80/api/test/1`).then(r => r.json());
	let queries = [] as any[];
	queries.push(fetch(`http://localhost:80/api/test`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ bar: IPS[0] })
	}).then(r => r.json()))
	queries = queries.concat(IPS.map(ip => fetch(`http://${ip}:80/api/test`).then(r => r.json())));
	
	const data = await Promise.all(queries);
	return NextResponse.json({
		write: data.slice(0, 2),
		reads: data.slice(2),
		before: before,
		desc
	});
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}
export const dynamic = "force-dynamic";