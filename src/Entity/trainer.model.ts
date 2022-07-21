import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CarDto, TrainerUpdate } from 'src/Dtos/trainer.dto';

export type TrainerDocument = Trainer & Document;

@Schema()
export class Trainer {
  @Prop({ type: String, required : true, unique : true})
  email: string;

  @Prop({type: String, required : true, unique: true})
  phonenumber: string;

  @Prop({ type : String, required : true, max: 20})
  trainername : string;

  @Prop({ type: Object, required : true })
  cardetails: { model: String, make : String, vin: String};

  @Prop({ type: [], required : false, default: [] })
  leavedetails: { leavereason: String, date : String}[];

  @Prop({ type: Boolean, required : false, default: false })
  status: boolean;

  @Prop({ required: false, default : Date.now })
  updatedAt : Date

  @Prop({ required : false, default : Date.now })
  createdAt : Date

  updateTrainer : Function;
}

export const TrainerSchema = SchemaFactory.createForClass(Trainer);

TrainerSchema.methods.updateTrainer = async function (updatedetails: TrainerUpdate) {
           const trainer = this;
           const objectTrainer = trainer.toObject();
           const keys = Object.keys(objectTrainer);
           for(let i = 0; i < keys.length; i++){
               switch(keys[i]){
                   case "cardetails":
                      const cardetails: CarDto = updatedetails[keys[i]];
                      const carkeys = Object.keys(cardetails);
                      for(let j = 0; j < carkeys.length;j++){
                          trainer[keys[i]][j] = cardetails[j];
                      }
                      break;
               }
           }

           await trainer.save();
           console.log(trainer, "trainer");
}
