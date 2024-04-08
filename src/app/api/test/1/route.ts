import { NextResponse } from "next/server";
import { IPS } from "@connect";

// test 1:
const desc = `
Concurrent transactions in two or more nodes are reading the same data item.
assumption: all nodes are properly set-up, running, and not locked
`
export const GET = async () => {
  try {
	const res = IPS.map(ip => fetch(`http://${ip}:80/api/foo/1`).then(r => r.json()));
	const data = await Promise.all(res);
	const strs = data.map(d => JSON.stringify(d));
	return NextResponse.json({
		res: data,
		equal: strs.every(s => s === strs[0]),
		desc
	});
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}
export const dynamic = "force-dynamic";