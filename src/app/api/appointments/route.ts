import { NextRequest, NextResponse } from "next/server";
import { read, write } from "@connect";
import { Appointment } from "@/components/Table/TableRow";


export const GET = async () => {
  try {
    const res = await read(async (conn) => {
      conn.sql("SELECT * FROM appointments")
    }, "READ COMMITTED");
    return NextResponse.json({ appointments: res });
  } catch (e) {
    console.error(e);
    return NextResponse.json(e, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
    try {
      const body = await req.json();
      const {
        pxid,
        clinicid,
        doctorid,
        status,
        queuedate,
        starttime,
        endtime,
        type,
        virtual,
		timequeued,
      } = body as Appointment;
      const res = await write(async (conn) => {
		const max_id = await conn.sql("SELECT MAX(apptid) as max_id FROM appointments");
		// add 1 to 32 character hex string max_id
		let apptid = max_id[0].max_id.split('');
		const hex = '0123456789ABCDEF';
		for (let i = apptid.length - 1; i --> 0;) {
			if (apptid[i] === 'F') {
				apptid[i] = '0';
			} else {
				apptid[i] = hex[hex.indexOf(apptid[i]) + 1];
				break;
			}
		}
		await conn.query(
			"INSERT INTO appointments (pxid, clinicid, doctorid, status, queuedate, starttime, endtime, type, `virtual`, apptid, timequeued) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			[
			  pxid,
			  clinicid,
			  doctorid,
			  status,
			  queuedate,
			  starttime,
			  endtime,
			  type,
			  virtual,
			  apptid.join(''),
			  timequeued
			]
		  );
		const res: any = await conn.query("SELECT * FROM appointments WHERE apptid = ?", [apptid.join('')]);	  
		return res[0][0];
	  }, "REPEATABLE READ");
      return NextResponse.json({ appointment: res });
    } catch (e) {
      console.error(e);
      return NextResponse.json(e, { status: 500 });
    }
  };
  
  export const PUT = async (req: NextRequest) => {
      try {
        const body = await req.json();
        const { apptid, pxid, clinicid, doctorid, status, timequeued, queuedate, starttime, endtime, type, virtual } = body as Appointment;
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
  
    export const DELETE = async (req: NextRequest) => {
      try {
        const body = await req.json();
        console.log(body)
        const { apptid } = body as { apptid: number };
        const res = await write(async conn =>
          conn.query("DELETE FROM appointments WHERE apptid = ?", [apptid])
        );
        return NextResponse.json({ message: 'Deleted successfully' });
      } catch (e) {
        console.error(e);
        return NextResponse.json(e, { status: 500 });
      }
    }

