import { NextRequest, NextResponse } from "next/server";
import { write } from "@connect";
import { Appointment } from "@/components/Table/TableRow";

type Params = {
	params: {
		apptid: string
	}
}

export const PUT = async (req: NextRequest, { params: {apptid} }: Params) => {
	try {
	  const body = await req.json();
	  const { pxid, clinicid, doctorid, status, timequeued, queuedate, starttime, endtime, type, virtual } = body as Appointment;
	  const res = await write(async conn => {
		await conn.query("UPDATE appointments SET pxid = ?, clinicid = ?, doctorid = ?, status = ?, timequeued = ?, queuedate = ?, starttime = ?, endtime = ?, type = ?, virtual = ? WHERE apptid = ?", [pxid, clinicid, doctorid, status, timequeued, queuedate, starttime, endtime, type, virtual, apptid])
		return conn.query("SELECT * FROM appointments WHERE apptid = ?", [apptid]) as any;
	  });
	  return NextResponse.json({ appointment: res[0][0] });
	} catch (e) {
	  console.error(e);
	  return NextResponse.json(e, { status: 500 });
	}
  }

  export const DELETE = async (req: NextRequest, { params: {apptid} }: Params) => {
	try {
	  const res = await write(async conn =>
		conn.query("DELETE FROM appointments WHERE apptid = ?", [apptid])
	  );
	  return NextResponse.json({ message: 'Deleted successfully' });
	} catch (e) {
	  console.error(e);
	  return NextResponse.json(e, { status: 500 });
	}
  }

