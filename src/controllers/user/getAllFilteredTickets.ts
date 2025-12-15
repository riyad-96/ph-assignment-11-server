import { Request, Response } from 'express';
import { ticketsCollection } from '../../connections/mongodb.connection.js';
import { FilterParams } from './types.js';
import { SortDirection } from 'mongodb';

type QueryFilterType = {
  status: 'approved';
  isFraud: { $ne: boolean };
  transport?: string;
  $or?: { [key: string]: { $regex: RegExp } }[];
};

type SortOptionsType = {
  [key: string]: SortDirection;
};

export default async function getAllFilteredTickets(req: Request, res: Response) {
  try {
    const { priceSort, searchQuery, transportType, page, limit }: FilterParams = req.body;

    const limitNumber = parseInt(limit || '6');
    const currentPage = parseInt(page || '1');
    const skip = (currentPage - 1) * limitNumber;

    const queryFilter: QueryFilterType = {
      status: 'approved',
      isFraud: { $ne: true },
    };

    if (transportType && transportType !== 'all') {
      queryFilter.transport = transportType;
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');

      queryFilter.$or = [
        { title: { $regex: searchRegex } },
        { from: { $regex: searchRegex } },
        { to: { $regex: searchRegex } },
        { transport: { $regex: searchRegex } },
      ];
    }

    let sortOptions: SortOptionsType = { created_at: -1 };
    if (priceSort === 'low-high') {
      sortOptions = { price: 1 };
    } else if (priceSort === 'high-low') {
      sortOptions = { price: -1 };
    }

    const totalTickets = await ticketsCollection().countDocuments(queryFilter);

    const filteredTickets = await ticketsCollection()
      .find(queryFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber)
      .toArray();

    res.send({
      data: filteredTickets,
      totalTickets: totalTickets,
      currentPage: currentPage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ code: 'INTERNAL_ERRORS', message: 'Error while fetching ticket data' });
  }
}
