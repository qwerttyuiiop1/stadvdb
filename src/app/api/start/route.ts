import { NextResponse } from "next/server";
import { promisify } from "util";
import { admin } from "../connectionController";
const exec = promisify(require("child_process").exec);

// sudo systemctl start mysql
// find and set master ip
// set global read_only = 1;
// start slave

export const GET = async () => {
  let { stdout, stderr } = await exec("sudo systemctl start mysql");
  if (stderr) {
	console.error(stderr);
	return NextResponse.json({ success: false });
  }
  console.log(stdout);
  await admin(async conn => {
	const [res] = await conn.sql("SHOW MASTER STATUS;");
  })
  return NextResponse.json({ success: true });
}