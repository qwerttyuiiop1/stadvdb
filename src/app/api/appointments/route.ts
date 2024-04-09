import { NextRequest, NextResponse } from "next/server";
import { read, write } from "@connect";
import { Appointment } from "@/components/Table/TableRow";


export const GET = async () => {
  try {
    const res = await read(async (conn) =>
      conn.sql("SELECT * FROM appointments")
    );
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
      } = body as Appointment;
      const res = await write(async (conn) => {
		const max_id = await conn.sql("SELECT MAX(apptid) as max_id FROM appointments");
		// add 1 to 32 character hex string max_id
		let apptid = max_id[0].max_id.split('');
		for (let i = apptid.length - 1; i --> 0;) {
			if (apptid[i] === 'F') {
				apptid[i] = '0';
			} else {
				apptid[i] = String.fromCharCode(apptid[i].charCodeAt(0) + 1);
				break;
			}
		}
        return await conn.query(
          "INSERT INTO appointments (pxid, clinicid, doctorid, status, queuedate, starttime, endtime, type, virtual) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
          ]
        );

	  });
      return NextResponse.json({ appointment: res });
    } catch (e) {
      console.error(e);
      return NextResponse.json(e, { status: 500 });
    }
  };
  
  export const PUT = async (req: NextRequest) => {
      try {
        const body = await req.json();
        const { apptid, pxid, clinicid, doctorid, status, queuedate, starttime, endtime, type, virtual } = body as Appointment;
        const res = await write(async conn =>
          conn.query("UPDATE appointments SET pxid = ?, clinicid = ?, doctorid = ?, status = ?, queuedate = ?, starttime = ?, endtime = ?, type = ?, virtual = ? WHERE apptid = ?", [pxid, clinicid, doctorid, status, queuedate, starttime, endtime, type, virtual, apptid])
        );
        return NextResponse.json({ appointment: res });
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

