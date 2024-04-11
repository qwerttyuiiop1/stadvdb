import { NextResponse } from "next/server"
import { read } from "../../connectionController"

const desc = `
Top 5 health facilities with the most number of appointments starting from 2021
`
export const GET = async () => {
  const res = await read(async conn => 
	conn.sql(`SELECT a.clinicid, COUNT(a.apptid) AS 'appt_count'
	FROM clinics c
	JOIN (SELECT a1.clinicid, a1.apptid FROM appointments a1 WHERE a1.starttime >= '2021-01-01') AS a
	ON c.clinicid = a.clinicid
	GROUP BY a.clinicid
	ORDER BY appt_count DESC
	LIMIT 5;`)
  )
  return NextResponse.json({
	res, desc
  });
}