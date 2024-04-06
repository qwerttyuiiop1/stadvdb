import mysql from "mysql";
import { promisify } from "util";

// string | undefined so that process.env can be passed without being casted
export const connectDB = (host: string | undefined, user: string | undefined) => {
	if (!host || !user)
		throw new Error("Host or user not provided");
	return mysql.createConnection({
		host: host,
		user: user,
		password: process.env.DB_PASSWORD,
		database: process.env.DATABASE
	});
}
export const readConnection = (host: string | undefined) => connectDB(host, process.env.READ_USER)
export const writeConnection = (host: string | undefined) => connectDB(host, process.env.WRITE_USER)
export const query = (sql: string, connection: mysql.Connection): Promise<any> => {
	return new Promise((resolve, reject) => {
		connection.query(sql, (err, result) => {
			if (err)
				reject(err);
			else
				resolve(result);
		});
	});
}

export const execute = (sql: string[] | string, connection: mysql.Connection): { start: ()=>Promise<any[]> } => {
	if (typeof sql === "string")
		sql = [sql];
	return {
		start: async () => {
			console.log("Executing queries");
			await Promise.resolve();
			const res = [];
			for (const s of sql)
				res.push(await query(s, connection));
			console.log(res);
			return res;
		}
	}
}