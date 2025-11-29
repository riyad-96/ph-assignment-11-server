// External imports
import { Db, MongoClient } from 'mongodb';

const URI = process.env.MONGODB_URI as string;
const DB_NAME = process.env.DB_NAME;
let db: Db;

async function connectToMongoDB() {
  const client = new MongoClient(URI);
  await client.connect();
  console.log('mongdb connected');
  db = client.db(DB_NAME);
}

function getDB() {
  if (!db) throw new Error('Database not found');
  return db;
}

export { connectToMongoDB, getDB };
