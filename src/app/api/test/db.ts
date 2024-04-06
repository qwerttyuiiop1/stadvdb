import mysql from "mysql";
import { promisify } from "util";

// string | undefined so that process.env can be passed without being casted
export const connectDB = (host: string | undefined, user: string | undefined) => {
	if (!host || !user)
		throw new Error("Host or user not provided");
	return mysql.createConnection({
		host: host,
		user: user,
		password: process.env.PASSWORD,
		database: process.env.DATABASE
	});
}
export const readConnection = (host: string | undefined) => connectDB(host, process.env.READ_USER)
export const writeConnection = (host: string | undefined) => connectDB(host, process.env.WRITE_USER)
export const execute = (sql: string[] | string, connection: mysql.Connection): { start: ()=>Promise<any[]> } => {
	const query = promisify(connection.query).bind(connection);
	if (typeof sql === "string")
		sql = [sql];
	return {
		start: async () => {
			await Promise.resolve();
			const res = [];
			for (const s of sql)
				res.push(await query(s));
			return res;
		}
	}
}