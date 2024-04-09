import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
	const connection = await mysql.createConnection({
	  host: 'localhost',
	  user: process.env.DB_USER,
	  password: process.env.DB_PASSWORD,
	  database: process.env.DATABASE
	});
	await connection.query('DELETE FROM foo WHERE id = 12');
	await connection.end();
	return NextResponse.json({ desc: 'Delete successful' });
  } catch (e) {
	console.error(e);
	return NextResponse.json(e, { status: 500 });
  }
}