import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import { Trainer, TrainerSchema } from './trainer.model';

export type ScheduleDocument = Schedule & Document;

@Schema()
export class Schedule {
  @Prop({ required : true, max: 20})
  schedulename: string;

  @Prop({ required : true, unique: true})
  scheduledate: string;

  @Prop({ required : false, unique : true})
  scheduletime: string;

  @Prop({ type: TrainerSchema, required : true })
  @Type(() => Trainer)
  trainerdetails: Trainer;

  @Prop({ required: true, type : ObjectId })
  userid : ObjectId

  @Prop({ required : false, default : Date.now })
  createdAt : Date

  @Prop({ required : false, default : Date.now })
  updateddAt : Date
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);