const SELF_IP = process.env.SELF_IP;
const IPS = [process.env.NODE_1_IP, process.env.NODE_2_IP, process.env.NODE_3_IP] as string[];
const PASSWORD = process.env.DB_PASSWORD;
const USER = process.env.USER;
const DATABASE = process.env.DATABASE;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_USER = process.env.ADMIN_USER;
const MAX_RETRIES = 3;
if (!SELF_IP || !PASSWORD || !USER || !DATABASE || IPS.some(ip => !ip) || !ADMIN_PASSWORD || !ADMIN_USER)
	throw new Error("Environment variables not provided");
import mysql from "mysql2/promise";
import { Awaitable } from "next-auth";
let masterIP = SELF_IP;
let readIP = SELF_IP;

async function findMasterIp() {
	const queries = IPS.map(async ip => {
		const conn = await mysql.createConnection({
			host: ip, user: ADMIN_USER, password: ADMIN_PASSWORD
		});
		const [res] = await conn.query<any>("SELECT @@global.read_only AS a;");
		conn.end();
		return res[0].a === 0 ? ip : null;
	})
	const res = await Promise.all(queries);
	return res.find(ip => ip !== null) || null;
}
async function electNewMaster() {
	return '';
}

async function findActiveServer() {
	const queries = IPS.map(async ip => {
	  try {
		const conn = await mysql.createConnection({
			host: ip, user: ADMIN_USER, password: ADMIN_PASSWORD
		});
		await conn.ping()
		conn.end();
		return ip;
	  } catch (e) {
		console.error(e)
		return null;
	  }
	})
	const res = await Promise.all(queries);
	return res.find(ip => ip !== null) || null;
}

interface sqlFunc {
	(sql: string): Promise<any>
	(sql: string[]): Promise<any[]>
	(sql: string[], i: number): Promise<any>
}
export interface Connection extends mysql.Connection {
	sql: sqlFunc
}
async function connectDB(host: string) {
	const ret = await mysql.createConnection({
		host: host, user: USER, password: PASSWORD, database: DATABASE
	}) as Connection;
	ret.sql = ((sql, i) => execute(ret, sql, i)) as sqlFunc;
	return ret;
}
const execute = async (connection: mysql.Connection, sql: string[] | string, i: number | undefined): Promise<any> => {
	if (typeof sql === "string") {
		sql = [sql];
		i = 0;
	}
	sql = sql.map(s => s.trim()).filter(s => s.length > 0);
	const res = [];
	for (const s of sql)
		res.push((await connection.query(s) as any)[0][0]);
	if (i === undefined) return res;
	return res[(i + res.length) % res.length];
}
export const read = async <T>(func: ((conn: Connection) => Awaitable<T>), server: undefined|1|2|3 = undefined): Promise<T> => {
	const max_retries = server === undefined ? MAX_RETRIES : 1;
	for (let i = 0; i < max_retries; i++) {
		try {
			const ip = server === undefined ? readIP : IPS[server - 1];
			const conn = await connectDB(ip);
			const ret = await func(conn);
			conn.end();
			return ret;
		} catch (e) {
			// handle error
		}
	}
	throw new Error("All servers are down");
}
export const write = async <T>(func: ((conn: Connection) => Awaitable<T>)): Promise<T> => {
	for (let i = 0; i < MAX_RETRIES; i++) {
		try {
			const conn = await connectDB(masterIP);
			const ret = await func(conn);
			conn.end();
			return ret;
		} catch (e) {
			// handle error
		}
	}
	throw new Error("All servers are down");
}