import { NextResponse } from "next/server"
import { read } from "../../connectionController"

const desc = `
Number of appointments based on health facility for each day of each year
`
export const GET = async () => {
  const res = await read(async conn => 
	conn.sql(`SELECT a.clinicid, a.starttime AS 'date', COUNT(a.apptid) AS 'appt_count'
	FROM appointments a
	WHERE a.starttime IS NOT NULL
	GROUP BY a.clinicid, date
	ORDER BY a.clinicid, date;`)
  )
  return NextResponse.json({
	res, desc
  });
}