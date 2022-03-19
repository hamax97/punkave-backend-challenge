import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherDocument = Weather & Document;

@Schema({ collection: 'weather' })
export class Weather {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  name: string;

  @Prop([
    {
      main: { type: String },
      description: { type: String },
    },
  ])
  summary: object[];

  @Prop(
    raw({
      temp: { type: Number },
      feelsLike: { type: Number },
      humidity: { type: Number },
    }),
  )
  main: Record<string, any>;

  @Prop(
    raw({
      all: { type: Number },
    }),
  )
  clouds: Record<string, any>;

  @Prop(
    raw({
      '1h': { type: Number },
      '3h': { type: Number },
    }),
  )
  snow: Record<string, any>;

  @Prop(
    raw({
      '1h': { type: Number },
      '3h': { type: Number },
    }),
  )
  rain: Record<string, any>;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
