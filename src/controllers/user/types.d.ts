import { ObjectId } from "mongodb"

export type Booking = {
  _id?: string | ObjectId;
  user_email: ObjectId;
  ticket_id: ObjectId;
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected' | 'paid';
  created_at: Date | number | string;
}