import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StationDocument = Station & Document;

@Schema()
export class Station {
  @Prop({ required: true })
  name: string;
}

export const StationSchema = SchemaFactory.createForClass(Station);
