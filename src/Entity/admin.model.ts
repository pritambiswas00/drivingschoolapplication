import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema()
export class Admin {
  @Prop({ required : true, unique : true})
  email: String;

  // @Prop({ required : true, unique : true})
  // phonenumber: String;

  @Prop({ required: true})
  password: String;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
