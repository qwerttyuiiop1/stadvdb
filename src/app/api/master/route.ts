import { NextResponse } from "next/server";
import { read } from "../connectionController";

export const GET = async () => {
	const res = await read(conn =>
		conn.sql("SELECT MEMBER_HOST FROM performance_schema.replication_group_members WHERE MEMBER_ROLE = \"PRIMARY\"")
	)
	return NextResponse.json(res[0].MEMBER_HOST);
}
export const dynamic = "force-dynamic";