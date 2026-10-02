// Armazenamento chave-valor mínimo sobre IndexedDB. Tudo fica só neste aparelho.

const DB_NAME = 'decalque'
const STORE = 'kv'

let dbPromise: Promise<IDBDatabase> | undefined

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  return dbPromise
}

function run<T>(mode: IDBTransactionMode, op: (store: IDBObjectStore) => IDBRequest): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const request = op(db.transaction(STORE, mode).objectStore(STORE))
        request.onsuccess = () => resolve(request.result as T)
        request.onerror = () => reject(request.error)
      }),
  )
}

export function getItem<T>(key: string): Promise<T | undefined> {
  return run<T | undefined>('readonly', (store) => store.get(key))
}

export function setItem(key: string, value: unknown): Promise<void> {
  return run<void>('readwrite', (store) => store.put(value, key))
}
