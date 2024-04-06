import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql";
export const GET = async (req: NextRequest) => {
	
	return NextResponse.json({ message: "Hello World" });
}