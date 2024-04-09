export const SELF_IP = process.env.SELF_IP;
export const IPS = [process.env.NODE_1_IP, process.env.NODE_2_IP, process.env.NODE_3_IP] as string[];
const PASSWORD = process.env.DB_PASSWORD;
const USER = process.env.DB_USER;
const DATABASE = process.env.DATABASE;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_USER = process.env.ADMIN_USER;
const MAX_RETRIES = 5;
if (!SELF_IP || !PASSWORD || !USER || !DATABASE || IPS.some(ip => !ip) || !ADMIN_PASSWORD || !ADMIN_USER)
	throw new Error("Environment variables not provided");
import mysql from "mysql2/promise";
type Awaitable<T> = T | PromiseLike<T>;
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
		await execAdmin(ip, undefined, conn => conn.ping());
		return true;
	} catch (e) {
		return false;
	}
}
async function _refresMasterIp() {
	const res = await read(conn => {
		return conn.sql("SELECT MEMBER_HOST FROM performance_schema.replication_group_members WHERE MEMBER_ROLE = \"PRIMARY\"")
	}, undefined)
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
type F<T> = (conn: Connection) => Awaitable<T>;
type IsolationLevel = "READ UNCOMMITTED" | "READ COMMITTED" | "REPEATABLE READ" | "SERIALIZABLE" | undefined;
async function executeSql(connection: mysql.Connection, sql: string[] | string, i: number | undefined) {
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
async function executeTransaction<T>(conn: Connection, isolation: IsolationLevel, func: F<T>) {
  try {
	if (isolation !== undefined) {
	  await conn.query(`SET TRANSACTION ISOLATION LEVEL ${isolation};`);
	  await conn.beginTransaction();
	}
	conn.sql = ((sql, i) => executeSql(conn, sql, i)) as sqlFunc;
	return await func(conn);
  } catch (e) {
	await conn.rollback();
	throw e;
  } finally {
	if (isolation !== undefined)
	  await conn.commit();
	await conn.end();
  }
}
async function execDB<T>(host: string, isolation: IsolationLevel, func: F<T>) {
  const conn = await mysql.createConnection({
	host: host, user: USER, password: PASSWORD, database: DATABASE
  }) as Connection;
  return executeTransaction(conn, isolation, func);
}
async function execAdmin<T>(host: string, isolation: IsolationLevel, func: F<T>) {
  const conn = await mysql.createConnection({
	host: host, user: ADMIN_USER, password: ADMIN_PASSWORD
  }) as Connection;
  return executeTransaction(conn, isolation, func);
}
const trySetReadIp = debounce(async () => {
	if (await ping(SELF_IP))
		readIP = SELF_IP;
})
export const read = async <T>(func: F<T>, isolation: IsolationLevel = undefined) => {
	// uncommitted writes are not possible in read-only nodes
	if (isolation === "READ UNCOMMITTED")
		return write(func, isolation);
	if (readIP !== SELF_IP)
		trySetReadIp();
	for (let i = 0; i < MAX_RETRIES; i++) {
		try {
			return await execDB(readIP, isolation, func)
		} catch (e: any) {
			if (e.code !== "ECONNREFUSED")
				throw e;
			await refreshReadIp();
		}
	}
	throw new Error("All servers are down");
}
export const write = async <T>(func: F<T>, isolation: IsolationLevel = undefined): Promise<T> => {
	for (let i = 0; i < MAX_RETRIES; i++) {
		try {
			return await execDB(masterIP, isolation, func);
		} catch (e: any) {
			if (e.code !== "ECONNREFUSED" && e.code !== "ER_OPTION_PREVENTS_STATEMENT")
				throw e;
			await refreshMasterIp();
		}
	}
	throw new Error("All servers are down");
}
export const admin = async <T>(func: F<T>, isolation: IsolationLevel = undefined, server: 'master'|'self' = 'master'): Promise<T> => {
	for (let i = 0; i < MAX_RETRIES; i++) {
		try {
			return await execAdmin(server === 'master' ? masterIP : SELF_IP, isolation, func);
		} catch (e: any) {
			if (e.code !== "ECONNREFUSED" && e.code !== "ER_OPTION_PREVENTS_STATEMENT" || server === 'self')
				throw e;
			await refreshMasterIp();
		}
	}
	throw new Error("All servers are down");
}

export type ScopedConnection = Connection & {endScope: ()=>Awaitable<void>}
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => any ? P : never;
type Scope = <F extends typeof read> (queryFunc: F) => 
	(...params: OmitFirstArg<F>) => Promise<ScopedConnection>;
export const scope: Scope = (queryFunc) => {
	return (...params) => new Promise((resolve) => {
		queryFunc(async conn => {
			await new Promise<void>(endScope => {
				(conn as ScopedConnection).endScope = endScope;
				resolve(conn as ScopedConnection);
			})
		}, ...params as any[])
	})
}