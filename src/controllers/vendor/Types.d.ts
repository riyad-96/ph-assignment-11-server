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
  departure_time: string | number | Date;
  created_at: string | number | Date;
  status: 'pending' | 'accepted' | 'rejected' | 'paid';
};

export type PieChartDataType = {
  name: string;
  value: number;
};

export type KPIDataArray = { label: string; value: number };

export type KPIDataRaw = {
  total_sell: number;
  total_tickets: number;
  total_sold_tickets: number;
  unsold_tickets: number;
  sales_percentage: number;
  average_ticket_price: number;
};

export type VendorRevenueDataType = {
  pie_chart: PieChartDataType[];
  kpi_display: KPIDataType;
};
