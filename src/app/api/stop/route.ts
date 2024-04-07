import { NextResponse } from "next/server";
import { exec } from "child_process";


export const GET = async () => {
  await new Promise((resolve, reject) => {
	exec("sudo systemctl stop mysql", (error, stdout, stderr) => {
	  if (error || stderr) {
		console.error(`error: ${error || stderr}`);
		return reject(error || stderr);
	  }
	  console.log(`stdout: ${stdout}`);
	  resolve(stdout);
	});
  });
  return NextResponse.json({ success: true });
}