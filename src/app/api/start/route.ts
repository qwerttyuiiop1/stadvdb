import { NextResponse } from "next/server";
import { promisify } from "util";
const exec = promisify(require("child_process").exec);

export const GET = async () => {
  let { stdout, stderr } = await exec("sudo systemctl start mysql");
  if (stderr) {
	console.error(stderr);
	return NextResponse.json({ success: false });
  }
  console.log(stdout);
  return NextResponse.json({ success: true });
}
export const dynamic = "force-dynamic";