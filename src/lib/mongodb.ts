import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");
const mongoUri: string = uri;

const globalForMongo = globalThis as unknown as { _pizzahubMongo?: MongoClient };

function createClient() {
  const client = new MongoClient(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });
  // Closes idle connections before Vercel suspends the instance, so they never go stale.
  attachDatabasePool(client);
  return client;
}

const client = globalForMongo._pizzahubMongo ?? createClient();
if (process.env.NODE_ENV !== "production") globalForMongo._pizzahubMongo = client;

export const db = client.db(process.env.MONGODB_DB);