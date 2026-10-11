// Voice samples are kept in IndexedDB on this device only. The persona JSON
// stores lightweight references; the audio never leaves the browser unless the
// user submits it to a connected voice engine.

const DB_NAME = "nexus-voice-samples";
const STORE = "samples";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  try {
    return await new Promise<T>((resolve, reject) => {
      const req = run(db.transaction(STORE, mode).objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

export const saveSample = (id: string, blob: Blob) => tx("readwrite", (s) => s.put(blob, id));
export const loadSample = (id: string) => tx<Blob | undefined>("readonly", (s) => s.get(id));
export const deleteSample = (id: string) => tx("readwrite", (s) => s.delete(id));
