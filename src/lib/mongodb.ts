import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

const globalForMongo = globalThis as unknown as { _pizzahubMongo?: MongoClient };
const client = globalForMongo._pizzahubMongo ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo._pizzahubMongo = client;

export const db = client.db(process.env.MONGODB_DB);