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
	throw new Error('not implemented')
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

type foo = string | string[]
export interface Connection extends mysql.Connection {
	sql: <T extends foo>(sql: T) => { start: ()=>Promise<T extends string ? any : any[]> }
}
async function connectDB(host: string) {
	const ret = await mysql.createConnection({
		host: host, user: USER, password: PASSWORD, database: DATABASE
	}) as Connection;
	ret.sql = sql => execute(ret, sql);
	return ret;
}
const execute = (connection: mysql.Connection, sql: string[] | string): { start: ()=>Promise<any[]> } => {
	let single = false;
	if (typeof sql === "string") {
		sql = [sql];
		single = true;
	}
	sql = sql.map(s => s.trim()).filter(s => s.length > 0);
	return {
		start: async () => {
			const res = [];
			for (const s of sql)
				res.push((await connection.query(s) as any)[0][0]);
			return single ? res[0] : res;
		}
	}
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
		} catch (e: any) {
			readIP = await findActiveServer() || readIP;
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
			const ip = await findMasterIp();
			if (ip)
				masterIP = ip
			else
				await electNewMaster();
		}
	}
	throw new Error("All servers are down");
}