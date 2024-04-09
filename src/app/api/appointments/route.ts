import { NextRequest, NextResponse } from "next/server";
import { read, write } from "@connect";
import { Appointment } from "@/components/Table/TableRow";


export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const limit = Number(params.get("limit"));
  const page = Number(params.get("page")) || 1;
  try {
	const order = " ORDER BY apptid DESC" +
		(limit ? ` LIMIT ${limit} OFFSET ${(page - 1) * limit}` : "");
    const res = await read(async (conn) => {
      conn.sql("SELECT * FROM appointments" + order)
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