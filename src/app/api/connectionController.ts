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
const debounce = <T>(func: () => Awaitable<T>, cache = 0) => {
	let running: Awaitable<T> | null = null;
	return async () => {
		if (running) return running;
		try {
			return await (running = func());
		} finally {
			setTimeout(() => running = null, cache);
		}
	}
}
async function raceQueries<T>(func: (conn: mysql.Connection) => Promise<T>) {
	const queries = IPS.map(async ip => {
	  const conn = await mysql.createConnection({
	    host: ip, user: ADMIN_USER, password: ADMIN_PASSWORD
	  })
	  try {
		return await func(conn);
	  } catch (e) {
		await new Promise((_, reject) => setTimeout(reject, 5000));
	  } finally {
		conn.end();
	  }
	});
	return await Promise.race(queries) as Promise<T>;
}



let masterIP = SELF_IP;
let readIP = SELF_IP;
async function _getServers() {
	const res = await raceQueries(async conn =>
	  conn.query(`SELECT MEMBER_HOST FROM performance_schema.replication_group_members WHERE MEMBER_STATE = "ONLINE"`)
	) as any;
	return res[0].map((r: any) => r.MEMBER_HOST) as string[];
}
const getServers = debounce(_getServers);
async function _refresMasterIp() {
	const res = await raceQueries(async conn =>
	  conn.query(`SELECT MEMBER_HOST FROM performance_schema.replication_group_members WHERE MEMBER_ROLE = "PRIMARY"`)
	) as any;
	masterIP = res[0][0].MEMBER_HOST!;
}
const refreshMasterIp = debounce(_refresMasterIp);
async function _refreshReadIp() {
	const ips = await getServers();
	if (ips.includes(SELF_IP!))
		readIP = SELF_IP!;
	else
		readIP = ips[Math.floor(Math.random() * ips.length)]!;
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
  let host = conn.config.host;
  if (host === "localhost" || !host) host = SELF_IP!;
  conn.sql = ((sql, i) => executeSql(conn, sql, i)) as sqlFunc;
  try {
	const isActive = getServers().then(ips => {
	  if (!ips.includes(host)) throw {code: "ECONNREFUSED"}
	});
	const res = async () => {
	  if (isolation !== undefined) {
	  	await conn.query(`SET TRANSACTION ISOLATION LEVEL ${isolation};`);
	  	await conn.beginTransaction();
	  }
	  const res = func(conn);
	  if (isolation !== undefined)
		await conn.commit();
	  return res;
    }
	return (await Promise.all([isActive, res()]))[1];
  } catch (e) {
	await conn.rollback();
	throw e;
  } finally {
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
export const read = async <T>(func: F<T>, isolation: IsolationLevel = undefined) => {
	// uncommitted writes are not possible in read-only nodes
	if (isolation === "READ UNCOMMITTED")
		return write(func, isolation);
	if (readIP !== SELF_IP)
		refreshReadIp();
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