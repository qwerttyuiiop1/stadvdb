import { ScopedConnection, admin, scope } from "../connectionController"
const adminScope = scope(admin);

const any = global as any;
any.lock = {
    conn: null,
    lock: async function() {
        if (this.conn) return;
        this.conn = await adminScope(undefined, 'self');
        await this.conn.query("FLUSH TABLES WITH READ LOCK;");
        console.log(Boolean(this.conn));
    },
    unlock: async function() {
        console.log(Boolean(this.conn));
        if (!this.conn) return;
        console.log("unlocking");
        await this.conn.query("UNLOCK TABLES;");
        await this.conn.endScope();
        console.log("unlocked");
        this.conn = null;
    }
}

export const lock = any.lock.lock as () => Promise<void>;
export const unlock = any.lock.unlock as () => Promise<void>;