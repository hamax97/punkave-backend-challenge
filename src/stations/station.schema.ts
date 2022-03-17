import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StationDocument = Station & Document;

@Schema()
export class Station {
  @Prop({ required: true })
  kioskId: number;

  @Prop({ required: true })
  coordinates: number[];

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  totalDocks: number;

  @Prop({ required: true })
  docksAvailable: number;

  @Prop({ required: true })
  bikesAvailable: number;

  @Prop({ required: true })
  addressStreet: string;

  @Prop({ required: true })
  addressCrity: string;

  @Prop({ required: true })
  addressState: string;

  @Prop({ required: true })
  addressZipCode: string;
}

export const StationSchema = SchemaFactory.createForClass(Station);
