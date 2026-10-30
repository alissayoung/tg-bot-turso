import { createClient } from "@libsql/client/web";

let client = null;

export function getDb() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
      console.warn("Turso credentials missing. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.");
      return null;
    }

    client = createClient({
      url,
      authToken,
    });
  }
  return client;
}

export async function initDb() {
  const db = getDb();
  if (!db) return;

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      message_count INTEGER DEFAULT 1,
      first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function recordUserMessage(from, text = "") {
  const db = getDb();
  if (!db) return;

  try {
    await initDb();
    
    // Upsert user in Turso SQLite
    await db.execute({
      sql: `
        INSERT INTO users (id, username, first_name, last_name, message_count, last_seen)
        VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          username = excluded.username,
          first_name = excluded.first_name,
          last_name = excluded.last_name,
          message_count = users.message_count + 1,
          last_seen = CURRENT_TIMESTAMP;
      `,
      args: [from.id, from.username || null, from.first_name || "", from.last_name || null],
    });

    // Log user message
    if (text) {
      await db.execute({
        sql: `INSERT INTO logs (user_id, text) VALUES (?, ?);`,
        args: [from.id, text.substring(0, 500)],
      });
    }
  } catch (err) {
    console.error("Turso DB error in recordUserMessage:", err);
  }
}

export async function getStats() {
  const db = getDb();
  if (!db) return null;

  try {
    await initDb();
    const usersResult = await db.execute("SELECT COUNT(*) AS total_users FROM users;");
    const msgsResult = await db.execute("SELECT SUM(message_count) AS total_messages FROM users;");
    
    return {
      totalUsers: usersResult.rows[0]?.total_users || 0,
      totalMessages: msgsResult.rows[0]?.total_messages || 0,
    };
  } catch (err) {
    console.error("Turso DB error in getStats:", err);
    return null;
  }
}
