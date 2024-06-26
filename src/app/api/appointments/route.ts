import { NextRequest, NextResponse } from "next/server";
import { read, write } from "@connect";
import { Appointment } from "@/components/Table/TableRow";



export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const limit = Number(params.get("limit"));
  const page = Number(params.get("page")) || 1;
  const conditions = [] as string[];
  const whereValues = [] as string[];
  if (params.get("pxid")) {
	conditions.push("pxid = ?");
	whereValues.push(params.get("pxid")!);
  }
  if (params.get("clinicid")) {
	conditions.push("clinicid = ?");
	whereValues.push(params.get("clinicid")!);
  }
  if (params.get("doctorid")) {
	conditions.push("doctorid = ?");
	whereValues.push(params.get("doctorid")!);
  }
  if (params.get("status")) {
	conditions.push("status = ?");
	whereValues.push(params.get("status")!);
  }
  if (params.get("timequeuedstart") && params.get("timequeuedend")) {
	conditions.push("timequeued BETWEEN ? AND ?");
	whereValues.push(params.get("timequeuedstart")!);
	whereValues.push(params.get("timequeuedend")!);
  } else if (params.get("timequeued")) {
	conditions.push("timequeued = ?");
	whereValues.push(params.get("timequeued")!);
  }
  if (params.get("queuedatestart") && params.get("queuedateend")) {
	conditions.push("timequeued BETWEEN ? AND ?");
	whereValues.push(params.get("queuedatestart")!);
	whereValues.push(params.get("queuedateend")!);
  } else if (params.get("queuedate")) {
	conditions.push("queuedate = ?");
	whereValues.push(params.get("queuedate")!);
  }
  if (params.get("starttime") && params.get("endtime")) {
	conditions.push("starttime BETWEEN ? AND ?");
	whereValues.push(params.get("starttime")!);
	whereValues.push(params.get("endtime")!);
  } else if (params.get("starttime")) {
	conditions.push("starttime = ?");
	whereValues.push(params.get("starttime")!);
  } else if (params.get("endtime")) {
	conditions.push("endtime = ?");
	whereValues.push(params.get("endtime")!);
  }
  if (params.get("type")) {
	conditions.push("type = ?");
	whereValues.push(params.get("type")!);
  }
  if (params.get("virtual")) {
	conditions.push("`virtual` = ?");
	whereValues.push(params.get("virtual")!);
  }
  if (params.get("apptid")) {
	conditions.push("apptid = ?");
	whereValues.push(params.get("apptid")!);
  }
  const where = conditions.length ? " WHERE " + conditions.join(" AND ") : "";
  const order = " ORDER BY apptid DESC" +
	(limit ? ` LIMIT ${limit} OFFSET ${(page - 1) * limit}` : "") + ";";
  
  try {
    const res = await read(async (conn) => {
      return conn.query("SELECT * FROM appointments" + where + order, whereValues);
    }, "READ COMMITTED");
    return NextResponse.json({ appointments: res[0] });
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