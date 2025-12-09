import type { Request, Response } from 'express';
import { usersCollection } from '../../connections/mongodb.connection.js';

export default async function getUsersData(req: Request, res: Response) {
  try {
    const userColl = usersCollection();
    const allUsers = await userColl.find().sort({ created_at: -1 }).toArray();
    const roleAdmin = allUsers.filter((u) => u.role === 'admin');
    const roleVendor = allUsers.filter((u) => u.role === 'vendor');
    const roleUser = allUsers.filter((u) => u.role === 'user');
    const sortedUserArray = [...roleAdmin, ...roleVendor, ...roleUser];

    res.send(sortedUserArray);
  } catch (err) {
    console.error(err);
    res.status(500).send({ code: 'INTERNAL_SERVER_ERROR', message: 'Error while fetching data' });
  }
}
