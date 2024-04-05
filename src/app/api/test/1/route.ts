import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql";
export const GET = async (req: NextRequest) => {
	const connection = mysql.createConnection({
		host: "ccscloud.dlsu.edu.ph",
		user: "test",
		password: "password",
		database: "stadvdb",
		port: 20150,
	});
	connection.connect();
	return NextResponse.json({ message: "Hello World" });
}