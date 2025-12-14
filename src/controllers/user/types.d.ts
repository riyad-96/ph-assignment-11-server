import { ObjectId } from "mongodb"

export type Booking = {
  _id?: string | ObjectId;
  user_email: string;
  vendor_email: string;
  ticket_id: ObjectId;
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected' | 'paid';
  created_at: Date | number | string;
}

export type BookedTicket= {
  _id?: string;
  title: string;
  thumbnail: string;
  from: string;
  to: string;
  price: number;
  quantity: number;
  total_price: number;
  departure_time: string | number | Date;
  status: 'pending' | 'accepted' | 'rejected' | 'paid';
}