import { ScopedConnection, admin, scope } from "../connectionController"
const adminScope = scope(admin);

let conn: ScopedConnection | null = null;
export const lock = async () => {
	if (conn) return;
	conn = await adminScope(undefined, 'self');
	await conn.query("FLUSH TABLES WITH READ LOCK;");
	console.log(conn);
}
export const unlock = async () => {
	if (!conn) return;
	console.log("unlocking");
	await conn.query("UNLOCK TABLES;");
	await conn.endScope();
	console.log("unlocked");
	conn = null;
}