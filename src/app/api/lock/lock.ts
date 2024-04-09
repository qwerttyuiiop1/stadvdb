import { ScopedConnection, admin, scope } from "../connectionController"
const adminScope = scope(admin);

const test = function() {
	let conn: ScopedConnection | null = null;
	const lock = async () => {
		if (conn) return;
		conn = await adminScope(undefined, 'self');
		await conn.query("FLUSH TABLES WITH READ LOCK;");
		console.log(Boolean(conn));
	}
	const unlock = async () => {
		console.log(Boolean(conn));
		if (!conn) return;
		console.log("unlocking");
		await conn.query("UNLOCK TABLES;");
		await conn.endScope();
		console.log("unlocked");
		conn = null;
	}
	return { lock, unlock };
}()

export const lock = test.lock;
export const unlock = test.unlock;