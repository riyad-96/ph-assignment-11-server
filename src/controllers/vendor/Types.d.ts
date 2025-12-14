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

export type BookedTicket = {
  _id?: string | ObjectId;
  user_name: string;
  user_email: string;
  title: string;
  quantity: number;
  total_price: number;
  created_at: string | number | Date;
  status: 'pending' | 'accepted' | 'rejected' | 'paid';
};
