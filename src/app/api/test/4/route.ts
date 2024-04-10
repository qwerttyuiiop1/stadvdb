import { IPS } from "@connect";
import { NextResponse } from "next/server";
 
const desc = `
The central node is unavailable during the execution of a transaction and then eventually comes back online
central node refers to the current master at the time the test is run
`

export const GET = async () => {
  try {
	await fetch(`http://localhost:80/api/_foo`, { 
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ bar: 'master' })
	});
	const before = await fetch(`http://localhost:80/api/test/1`).then(r => r.json());

	const master = await fetch("http://localhost:80/api/master").then(r => r.json());
	const ips = IPS.filter(ip => ip !== master);
	const ip = ips[Math.floor(Math.random() * ips.length)];
	await fetch(`http://${master}:80/api/stop`);
	await fetch(`http://${ip}:80/api/_foo`, { 
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ bar: ip })
	});

	await fetch(`http://${master}:80/api/start`);
	await new Promise(r => setTimeout(r, 1000));
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
export const dynamic = 'force-dynamic';