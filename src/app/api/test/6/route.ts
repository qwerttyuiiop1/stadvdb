import { NextResponse } from "next/server";
import { IPS } from "../../connectionController";

const desc = `
Failure in writing to the central node when attempting to replicate the transaction from Node 1 or Node 2
`

export const GET = async () => {
  try {
	return NextResponse.json({
	  desc,
	  result: "This test is impossible to perform because Node 1 or 2 cannot write"
		+ ", so it is impossible for the central node to be behind from Node 1 or 2."
    });
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
