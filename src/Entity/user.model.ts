import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required : true, unique : true})
  billnumber : String;

  @Prop({ required : true})
  email: String;

  @Prop({ required : true, unique : true })
  phonenumber: String;

  @Prop({ required : true })
  name : String;

  @Prop({ required : true })
  startDate : String;

  @Prop({ required : false, default : "" })
  endDate : String;

  @Prop({ required : false, default : false })
  isVerified: Boolean;

  @Prop({ required : false, default : "1234" })
  otp : String;

  @Prop({ required : false, default : Date.now })
  createdAt : Date

  @Prop({ required : true, trim : true})
  password : String;

  @Prop({ required: false, default : Date.now })
  updatedAt : Date

  @Prop({required: false, default: [] })
  schedules: { schedulename: String, scheduledate: String, trainerdetails: { email: String, phonenumber: String, trainername: String,  cardetails: { model : String, make : String, vin : String }} }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
