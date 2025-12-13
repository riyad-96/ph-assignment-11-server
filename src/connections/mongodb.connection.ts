// External imports
import { Collection, Db, MongoClient, Document } from 'mongodb';
import { User } from '../controllers/auth/UserTypes.js';
import { Ticket } from '../controllers/vendor/Types.js';
import { Booking } from '../controllers/user/types.js';

const URI = process.env.MONGODB_URI as string;
const DB_NAME = process.env.DB_NAME;
let db: Db;

async function connectToMongoDB(callback: () => void) {
  const client = new MongoClient(URI);
  await client.connect();
  console.log('mongdb connected');
  callback();
  db = client.db(DB_NAME);
}

function getCollection<T extends Document>(name: string): Collection<T> {
  if (!db) throw new Error('DB not initialized. Call connectToDB() first.');
  return db.collection<T>(name);
}

const usersCollection = () => getCollection<User>('users');
const ticketsCollection = () => getCollection<Ticket>('tickets');
const bookingsCollection = () => getCollection<Booking>('bookings');

export { connectToMongoDB, usersCollection, ticketsCollection, bookingsCollection };
