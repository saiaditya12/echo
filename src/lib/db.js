import initSqlJs from 'sql.js';

const IDB_NAME = 'echoes_time_capsules_db';
const STORE_NAME = 'sqlite_storage';
const DB_KEY = 'sqlite_binary_snapshot';

let dbInstance = null;
let initPromise = null;

/**
 * Open or initialize IndexedDB connection
 */
function openIDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }
    const request = window.indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const idb = event.target.result;
      if (!idb.objectStoreNames.contains(STORE_NAME)) {
        idb.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Load SQLite binary snapshot from IndexedDB
 */
async function loadFromIDB() {
  try {
    const idb = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(DB_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[Echoes DB] Could not read from IndexedDB, starting fresh:', err);
    return null;
  }
}

/**
 * Save SQLite binary snapshot to IndexedDB
 */
async function saveToIDB(binaryData) {
  try {
    const idb = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(binaryData, DB_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('[Echoes DB] Failed to save SQLite snapshot to IndexedDB:', err);
    throw err;
  }
}

/**
 * Initialize sql.js WASM and restore or create SQLite database
 */
export async function initDB() {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: () => '/sql-wasm.wasm',
      });

      const savedData = await loadFromIDB();
      if (savedData && savedData.byteLength > 0) {
        try {
          dbInstance = new SQL.Database(new Uint8Array(savedData));
        } catch (e) {
          console.warn('[Echoes DB] Existing snapshot corrupt, resetting:', e);
          dbInstance = new SQL.Database();
        }
      } else {
        dbInstance = new SQL.Database();
      }

      // Ensure the capsules schema exists
      dbInstance.run(`
        CREATE TABLE IF NOT EXISTS capsules (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          unlock_date TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);

      return dbInstance;
    } catch (err) {
      console.error('[Echoes DB] Initialization error:', err);
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

/**
 * Retrieve all capsules ordered by unlock date
 */
export function getCapsules() {
  if (!dbInstance) {
    throw new Error('Database is not initialized. Call initDB() first.');
  }

  const res = dbInstance.exec(`
    SELECT id, title, message, unlock_date, created_at
    FROM capsules
    ORDER BY datetime(unlock_date) ASC
  `);

  if (!res || res.length === 0) {
    return [];
  }

  const { columns, values } = res[0];
  return values.map((row) => {
    const item = {};
    columns.forEach((col, idx) => {
      item[col] = row[idx];
    });
    return item;
  });
}

/**
 * Insert a new capsule and persist snapshot to IndexedDB
 */
export async function createCapsule({ title, message, unlock_date }) {
  if (!dbInstance) {
    await initDB();
  }

  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'echo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  
  const created_at = new Date().toISOString();

  const stmt = dbInstance.prepare(
    'INSERT INTO capsules (id, title, message, unlock_date, created_at) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run([id, title.trim(), message.trim(), unlock_date, created_at]);
  stmt.free();

  // Export database to Uint8Array and persist in IndexedDB
  const binary = dbInstance.export();
  await saveToIDB(binary);

  return { id, title: title.trim(), message: message.trim(), unlock_date, created_at };
}

/**
 * Delete a capsule and persist updated database snapshot
 */
export async function deleteCapsule(id) {
  if (!dbInstance) {
    await initDB();
  }

  const stmt = dbInstance.prepare('DELETE FROM capsules WHERE id = ?');
  stmt.run([id]);
  stmt.free();

  const binary = dbInstance.export();
  await saveToIDB(binary);

  return true;
}
