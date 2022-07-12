import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';
import { Trainer, TrainerSchema } from './trainer.model';

export type ScheduleDocument = Schedule & Document;

@Schema()
export class Schedule {
  @Prop({ required : true})
  schedulename: string;

  @Prop({ required : true, unique: true})
  scheduledate: string;

  @Prop({ required : false, unique : true})
  scheduletime: string;

  @Prop({ type: TrainerSchema, required : true })
  @Type(() => Trainer)
  trainerdetails: Trainer;

  @Prop({ required: true })
  userid : string
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);