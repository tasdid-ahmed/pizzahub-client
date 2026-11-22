import { MongoClient, type Db } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");
const mongoUri: string = uri;
const dbName = process.env.MONGODB_DB;

type MongoState = { client: MongoClient; stale: boolean };
const globalForMongo = globalThis as unknown as { _pizzahubMongo?: MongoState };

function createState(): MongoState {
  const client = new MongoClient(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 6000,
    connectTimeoutMS: 6000,
    family: 4, // force IPv4, avoids slow dual-stack lookups in serverless
  });
  const state: MongoState = { client, stale: false };
  attachDatabasePool(client);
  // A closed topology never recovers by itself. Mark it so the next access builds a fresh client.
  client.on("topologyClosed", () => {
    state.stale = true;
  });
  return state;
}

function currentDb(): Db {
  let state = globalForMongo._pizzahubMongo;
  if (!state || state.stale) {
    const previous = state;
    state = createState();
    globalForMongo._pizzahubMongo = state;
    void previous?.client.close().catch(() => undefined);
  }
  return state.client.db(dbName);
}

/** Always resolves to a healthy client, so Better Auth never keeps a dead one. */
export const db = new Proxy({} as Db, {
  get(_target, property) {
    const real = currentDb();
    const value = Reflect.get(real, property, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});