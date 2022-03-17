export interface StationDto {
  kioskId: number;
  coordinates: number[];
  name: string;
  totalDocks: number;
  docksAvailable: number;
  bikesAvailable: number;
  addressStreet: string;
  addressCrity: string;
  addressState: string;
  addressZipCode: string;
  [otherField: string]: any;
}
