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
