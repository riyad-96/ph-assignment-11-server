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
  price: number;
  quantity: number;
  departure_time: Date | string | number;
  perks: string[];
  created_at: Date | string | number;
  updated_at: Date | string | number;
  isOnAd: boolean;
};
