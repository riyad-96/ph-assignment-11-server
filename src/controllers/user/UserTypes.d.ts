import { ObjectId } from 'mongodb';

export type User = {
  _id?: ObjectId;
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  role: 'user' | 'vendor' | 'admin';
  isFraud: boolean;
  created_at: Date;
  updated_at: Date;
};

export type NewUser = {
  email: string;
  password: string;
  name: string;
  photoURL: string;
};

export type UpdateInfo = {
  name: string;
  photoURL: string;
}