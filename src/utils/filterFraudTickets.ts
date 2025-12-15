import { usersCollection } from '../connections/mongodb.connection.js';
import type { Ticket } from '../controllers/vendor/types.js';

export default async function getFraudFilteredTickets(tickets: Ticket[]) {
  const fraudVendors = await usersCollection().find({ isFraud: true }).toArray();
  const fraudVendorEmails = fraudVendors.map((vendor) => vendor.email);
  return tickets.filter((ticket) => !fraudVendorEmails.includes(ticket.vendor_email));
}
