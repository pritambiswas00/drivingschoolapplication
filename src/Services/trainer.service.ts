import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model} from "mongoose";
import { TrainerCreate, TrainerUpdate } from "src/Dtos/trainer.dto";
import { Trainer, TrainerDocument } from "src/Entity/trainer.model";
import { UtilService } from "src/Utils/Utils";


@Injectable()
export class TrainerService{
    constructor(@InjectModel(Trainer.name) private readonly trainerModel: Model<TrainerDocument>, private readonly configService: ConfigService, private readonly utilService: UtilService){}

    async findTrainerBasedOnEmail(email : string) {
         const isTrainerExist = await this.trainerModel.findOne({ email : email });
         if(!isTrainerExist) return null;
         return isTrainerExist;
    }


    async create(trainer: TrainerCreate) {
         const newTrainer = new this.trainerModel(trainer);
         await newTrainer.save();
         return newTrainer;
    }

    async deleteTrainer(trainerid: ObjectId) { 
         const trainer = await this.trainerModel.findByIdAndDelete({
          _id: trainerid
         });
         if(!trainer) return null;
         return trainer;
    }

    async getAllTrainer() {
        const trainers = await this.trainerModel.find({});
        if(!trainers) return null;
        return trainers;
    }
    
    async findTrainerBasedOnEmailAndPhone(email: string, phonenumber: string) {
            try{
               const trainer = await this.trainerModel.findOne({ email: email, phonenumber: phonenumber });
               if(!trainer) return null;
               return trainer;
            }catch(error){
               throw new InternalServerErrorException(error)
            }
    }

    async findOneById(id: ObjectId):Promise<Trainer> {
        const trainer = await this.trainerModel.findOne({ _id: id });
        return trainer;
    }

    async editTrainer(trainer: TrainerUpdate, id: ObjectId):Promise<Trainer>{
        console.log(trainer, "TRAINER")
        const trainerexist = await this.trainerModel.findOne({ _id: id });
        if(!trainerexist){
            throw new NotFoundException("Trainer not found.");
        }
        const updatedKeys = Object.keys(trainer);
        for(let i = 0; i < updatedKeys.length; i++) {
             switch(trainer[updatedKeys[i]]){
                 case 'email':
                 case 'trainername':
                      trainerexist[updatedKeys[i]] = trainer[updatedKeys[i]];
                      break;
                 default:
                      break;
             }
        }

        await trainerexist.save();
        return trainerexist;
    }
}
