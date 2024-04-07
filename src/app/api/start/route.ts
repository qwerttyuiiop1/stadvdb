import { NextResponse } from "next/server";
import { exec } from "child_process";

// sudo systemctl start mysql
// set global read_only = 1;
// find and set master ip
// start slave

export const GET = async () => {
  return NextResponse.json({ success: true });
}