import { Types } from 'mongoose';
import { TransactionType, TransactionStatus } from '../models/transaction.model';

const buildFilters = (filters: any, user: string) => {
  const query: any = {
    user: new Types.ObjectId(user),
  };

  // Handle transaction type filtering
  if (filters.tone) {
    const tone = filters.tone.toString().trim().toLowerCase()
    // console.log('tone:', tone);

    if (Object.values(TransactionType).includes(tone as TransactionType)) {
      query.transactionType = tone;
    } else if (
      Object.values(TransactionStatus).includes(tone as TransactionStatus)
    ) {
      query.status = tone;
    } else {
      console.error(`Invalid filter: ${filters.tone}`)
    }
  }

  // Handle date range filtering
  if (filters.startDate && filters.endDate) {
    // Convert date strings to valid Date objects
    const startDate = parseDate(filters.startDate);
    const endDate = parseDate(filters.endDate);

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
  }

  // Remove keys with undefined values to prevent them from being reflected in the query
  Object.keys(query).forEach(
    (key) => query[key] === undefined && delete query[key]
  );

  return query;
};

// Helper function to parse date from DD/MM/YY to YYYY-MM-DD
const parseDate = (dateString: string): Date | null => {
  // Example date format conversion, adjust as needed
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
    const formattedDate = `${year}-${month}-${day}`;
    const date = new Date(formattedDate);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
};

export default buildFilters;
