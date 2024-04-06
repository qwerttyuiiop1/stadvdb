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
import mysql from "mysql";
import { Awaitable } from "next-auth";
import { promisify } from "util";
let masterIP = SELF_IP;
let readIP = SELF_IP;

async function findMasterIp() {
	const queries = IPS.map(ip => new Promise<string | null>((resolve) => {
		const conn = mysql.createConnection({
			host: ip, user: ADMIN_USER, password: ADMIN_PASSWORD
		});
		conn.connect(err => {
			if (err) return resolve(null);
			conn.query("SELECT @@global.read_only AS a", (err, result) => {
				resolve(err || result[0]?.a === 1 ? null : ip);
			});
		});
	}));
	const res = await Promise.all(queries);
	return res.find(ip => ip !== null) || null;
}
async function findActiveServer() {
	throw new Error("Not implemented");
}

export interface Connection extends mysql.Connection {
	execute: (sql: string[]) => { start: ()=>Promise<any[]> }
}
async function connectDB (host: string) {
	const ret = mysql.createConnection({
		host: host, user: USER, password: PASSWORD, database: DATABASE
	}) as Connection;
	await new Promise<void>((resolve, reject) => {
		ret.connect(err => {
			if (err) reject(err);
			else resolve();
		});
	});
	ret.execute = sql => execute(ret, sql);
	return ret;
}
async function query(sql: string, connection: mysql.Connection) {
	return new Promise<any[]>((resolve, reject) => {
		connection.query(sql, (err, result) => {
			if (err) reject(err);
			else resolve(result);
		});
	});
}
const execute = (connection: mysql.Connection, sql: string[] | string): { start: ()=>Promise<any[]> } => {
	if (typeof sql === "string")
		sql = [sql];
	sql = sql.map(s => s.trim()).filter(s => s.length > 0);
	return {
		start: async () => {
			await Promise.resolve();
			const res = [];
			for (const s of sql)
				res.push(await query(s, connection));
			return res;
		}
	}
}
export const read = async <T>(func: ((conn: Connection) => Awaitable<T>), server: undefined|1|2|3): Promise<T> => {
	const ip = server === undefined ? readIP : IPS[server - 1];
	for (let i = 0; i < MAX_RETRIES; i++) {
		try {
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