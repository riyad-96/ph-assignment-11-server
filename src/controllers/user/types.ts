import { ObjectId } from "mongodb"

export type Booking = {
  _id?: ObjectId;
  user_email: string;
  vendor_email: string;
  ticket_id: ObjectId;
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected' | 'paid';
  created_at: Date | number | string;
}

export type BookedTicket= {
  _id?: ObjectId;
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

export type Transaction = {
  _id?: ObjectId;
  transaction_id: string;
  amount: number;
  created_at: Date | number | string;
  session_id: string;
  ticket_id: ObjectId;
  booking_id: ObjectId;
  user_email: string;
  vendor_email: string;
}