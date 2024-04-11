import { NextResponse } from "next/server"
import { read } from "../../connectionController"

const desc = `
Total patient count per health facility in Visayas
`
export const GET = async () => {
  const res = await read(async conn => 
	conn.sql(`SELECT c . clinicid ,
	c . regionname ,
	COUNT ( DISTINCT a . pxid ) AS ' patient_count '
	FROM clinics c
	LEFT JOIN appointments a
	ON c . clinicid = a . clinicid
	WHERE c . regionname LIKE '% Visayas % '
	GROUP BY c . clinicid , c . regionname
	ORDER BY c . clinicid ;`)
  )
  return NextResponse.json({
	res, desc
  });
}