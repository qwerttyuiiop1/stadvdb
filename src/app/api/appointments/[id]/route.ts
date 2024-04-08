import { NextRequest, NextResponse } from "next/server";
import { write } from "@connect";
import { Appointment } from "@/components/TableRow";


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
      const res = await write(async (conn) =>
        conn.sql(
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
        )
      );
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
          conn.sql("UPDATE appointments SET pxid = ?, clinicid = ?, doctorid = ?, status = ?, queuedate = ?, starttime = ?, endtime = ?, type = ?, virtual = ? WHERE apptid = ?", [pxid, clinicid, doctorid, status, queuedate, starttime, endtime, type, virtual, apptid])
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
          conn.sql("DELETE FROM appointments WHERE apptid = ?", [apptid])
        );
        return NextResponse.json({ message: 'Deleted successfully' });
      } catch (e) {
        console.error(e);
        return NextResponse.json(e, { status: 500 });
      }
    }