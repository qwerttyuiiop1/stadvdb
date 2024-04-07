import { NextResponse } from "next/server";
import { promisify } from "util";
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
  
  return NextResponse.json({ success: true });
}