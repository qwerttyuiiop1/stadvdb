import { NextResponse } from "next/server";
import { IPS } from "@connect";
const desc = `
test 2: Concurrent transactions in two or more nodes are writing (update / delete) the same data item.
assumption: all nodes are properly set-up, running, and not locked
`;
export const GET = async () => {
  const shuffled = IPS.slice().sort(() => Math.random() - 0.5);
  try {
	await fetch(`http://localhost:80/api/_foo`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ bar: "bar" })
	});
	const before = await fetch(`http://localhost:80/api/test/1`).then(r => r.json());
	
	const queries = shuffled.map(ip => fetch(`http://${ip}:80/api/_foo`, {
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
		after,
		desc
	});
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}
export const dynamic = "force-dynamic";