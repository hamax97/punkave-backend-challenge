import { HttpException, HttpStatus } from '@nestjs/common';

export function parseDate(date: string) {
  const dateParsed = new Date(date);
  if (isNaN(dateParsed.getDate())) {
    throw new HttpException(
      `Couldn't parse date string: ${date}`,
      HttpStatus.BAD_REQUEST,
    );
  }

  return dateParsed;
}

export function createQueryBy(date: Date) {
  return {
    $expr: {
      $and: [
        { $eq: [{ $year: '$date' }, date.getFullYear()] },
        { $eq: [{ $month: '$date' }, date.getMonth() + 1] },
        { $eq: [{ $dayOfMonth: '$date' }, date.getDate()] },
        { $eq: [{ $hour: '$date' }, date.getHours()] },
      ],
    },
  } as object;
}
