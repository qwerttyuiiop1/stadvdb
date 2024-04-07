export const SELF_IP = process.env.SELF_IP;
export const IPS = [process.env.NODE_1_IP, process.env.NODE_2_IP, process.env.NODE_3_IP] as string[];
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

const debounce = <T>(func: () => Awaitable<T>) => {
	let running: Awaitable<T> | null = null;
	return async () => {
		if (running) return running;
		try {
			return await (running = func());
		} finally {
			running = null;
		}
	}
}
async function ping(ip: string) {
	try {
		const conn = await connectAdmin(ip);
		await conn.ping();
		conn.end();
		return true;
	} catch (e) {
		return false;
	}
}
async function _refresMasterIp() {
	const res = await read(conn =>
		conn.sql("SELECT MEMBER_HOST FROM performance_schema.replication_group_members WHERE MEMBER_ROLE = \"PRIMARY\"")
	)
	masterIP = res[0].MEMBER_HOST;
}
const refreshMasterIp = debounce(_refresMasterIp);
async function _refreshReadIp() {
	const queries = IPS.map(async ip => await ping(ip) ? ip : null);
	const res = await Promise.all(queries)
	const ips = res.filter(ip => ip !== null) as string[];
	if (ips.includes(SELF_IP!))
		readIP = SELF_IP!;
	else
		readIP = ips[Math.floor(Math.random() * ips.length)];
}
const refreshReadIp = debounce(_refreshReadIp);

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
async function connectAdmin(host: string) {
	const ret = await mysql.createConnection({
		host: host, user: ADMIN_USER, password: ADMIN_PASSWORD
	}) as Connection;
	ret.sql = ((sql, i) => execute(ret, sql, i)) as sqlFunc;
	return ret;
}
async function execute(connection: mysql.Connection, sql: string[] | string, i: number | undefined) {
	if (typeof sql === "string") {
		sql = [sql];
		i = 0;
	}
	sql = sql.map(s => s.trim()).filter(s => s.length > 0);
	const res = [];
	for (const s of sql)
		res.push((await connection.query(s))[0]);
	if (i === undefined) return res;
	return res[(i + res.length) % res.length];
}
const trySetReadIp = debounce(async () => {
	if (await ping(SELF_IP))
		readIP = SELF_IP;
})
export const read = async <T>(func: ((conn: Connection) => Awaitable<T>), server: undefined|number = undefined): Promise<T> => {
	const max_retries = server === undefined ? MAX_RETRIES : 1;
	if (readIP !== SELF_IP)
		trySetReadIp();
	for (let i = 0; i < max_retries; i++) {
		try {
			const ip = server === undefined ? readIP : IPS[server - 1];
			const conn = await connectDB(ip);
			const ret = await func(conn);
			conn.end();
			return ret;
		} catch (e: any) {
			if (e.code !== "ECONNREFUSED")
				throw e;
			await refreshReadIp();
		}
	}
	throw new Error("All servers are down");
}
export const write = async <T>(func: ((conn: Connection) => Awaitable<T>)): Promise<T> => {
	for (let i = 0; i < MAX_RETRIES; i++) {
		try {
			const conn = await connectDB(masterIP!);
			const ret = await func(conn);
			conn.end();
			return ret;
		} catch (e: any) {
			console.error('TODO: test no write access code first', e);
			throw e;
			if (e.code !== "ECONNREFUSED" && e.code !== "ER_DBACCESS_DENIED_ERROR")
				throw e;
			await refreshMasterIp();
		}
	}
	throw new Error("All servers are down");
}
export const admin = async <T>(func: ((conn: Connection) => Awaitable<T>)): Promise<T> => {
	for (let i = 0; i < MAX_RETRIES; i++) {
		try {
			const conn = await connectDB(masterIP!);
			const ret = await func(conn);
			conn.end();
			return ret;
		} catch (e: any) {
			console.error('TODO: test no write access code first', e);
			throw e;
			if (e.code !== "ECONNREFUSED" && e.code !== "ER_DBACCESS_DENIED_ERROR")
				throw e;
			await refreshMasterIp();
		}
	}
	throw new Error("All servers are down");
}