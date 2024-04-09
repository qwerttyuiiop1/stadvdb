import { NextResponse } from "next/server";
import { IPS } from "../../connectionController";

const desc = `
Failure in writing to Node 2 or Node 3 when attempting to replicate the transaction from the central node
central node refers to the current master at the time the test is run
`

export const GET = async () => {
	try {
	  await fetch(`http://localhost:80/api/foo/1`, { 
		  method: "PUT",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ bar: 'master' })
	  });
	  const before = await fetch(`http://localhost:80/api/test/1`).then(r => r.json());
  
	  const master = await fetch("http://localhost:80/api/master").then(r => r.json());
	  const ips = IPS.filter(ip => ip !== master);
	  const ip = ips[Math.floor(Math.random() * ips.length)];
  
	  const sleep = fetch(`http://${ip}:80/api/lock/10`);
	  await new Promise(r => setTimeout(r, 3000));
	  await fetch(`http://${master}:80/api/foo/1`, {
		  method: "PUT",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ bar: master })
	  });
  
	  await sleep;
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
