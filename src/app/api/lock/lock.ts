import { ScopedConnection, admin, scope } from "../connectionController"
const adminScope = scope(admin);

let conn: ScopedConnection | null = null;
export const lock = async () => {
	if (conn) return;
	conn = await adminScope(undefined, 'self');
	conn.query("FLUSH TABLES WITH READ LOCK;");
}
export const unlock = async () => {
	if (!conn) return;
	conn.query("UNLOCK TABLES;");
	conn.endScope();
	conn = null;
}