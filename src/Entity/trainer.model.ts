import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrainerDocument = Trainer & Document;

@Schema()
export class Trainer {
  @Prop({ type: String,required : false, default : "", unique : true})
  email: string;

  @Prop({type: String, required : true, unique: true})
  phonenumber: string;

  @Prop({ type : String, required : true})
  trainername : string;

  @Prop({ type: Object, required : true })
  cardetails: { model: String, make : String, vin: String };
}

export const TrainerSchema = SchemaFactory.createForClass(Trainer);