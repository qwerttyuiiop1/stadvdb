import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const conn = await mysql.createConnection({
		host: 'localhost', user: process.env.ADMIN_USER, password: process.env.ADMIN_PASSWORD
  	});
	await conn.ping();
	return NextResponse.json({ success: true });
  } catch (e) {
	console.error(e);
	return NextResponse.json({ error: e })
  }
}