import { Request, Response } from 'express';
import { ticketsCollection, usersCollection } from '../../connections/mongodb.connection.js';
import { User } from '../auth/types.js';

function filterUsers(role: string, users: User[]) {
  if (role === 'fraud_vendor') {
    return {
      name: 'Fraud vendors',
      value: users.filter((user) => user.role === 'vendor' && user.isFraud).length,
    };
  } else {
    return {
      name: role[0].toUpperCase() + role.slice(1),
      value: users.filter((user) => user.role === role).length,
    };
  }
}

export default async function getVendorDashboardStats(req: Request, res: Response) {
  try {
    const users = await usersCollection().find().toArray();
    const tickets = await ticketsCollection().find().toArray();

    // user stats
    const userStats = ['user', 'vendor', 'admin', 'fraud_vendor'].map((role) =>
      filterUsers(role, users),
    );

    // tickets
    const ticketStats = ['pending', 'approved', 'rejected'].map((status) => ({
      name: status[0].toUpperCase() + status.slice(1),
      value: tickets.filter((ticket) => ticket.status === status).length,
    }));

    res.send({
      total_users: users.length,
      user_stats: userStats,
      total_tickets: tickets.length,
      ticket_stats: ticketStats,
    });
  } catch (err) {
    console.error(err);
    res.send({ code: 'SERVER_ERROR', message: 'An unexpected internal server error occurred.' });
  }
}
