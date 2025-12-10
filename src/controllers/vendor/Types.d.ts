import { ObjectId } from 'mongodb';

export type Ticket = {
  _id?: string | ObjectId;
  vendor_email: string;
  vendor_name: string;
  title: string;
  thumbnail: string;
  status: 'pending' | 'approved' | 'rejected';
  from: string;
  to: string;
  transport: string;
  price: number | string;
  quantity: number | string;
  departure_time: Date | string | number;
  perks: string[];
};
