import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TrainerDto } from "src/Dtos/auth.user.Dtos";
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


    async create(trainer: TrainerDto) {
         const newTrainer = new this.trainerModel(trainer);
         await newTrainer.save();
         return newTrainer;
    }

    async deleteTrainer(trainerid: string) { 
         const trainer = await this.trainerModel.findByIdAndDelete({
          _id: trainerid
         });
         if(!trainer) return null;
         return trainer;
    }

    async getAllTrainer() {
        const trainers = await this.trainerModel.find({});
        return trainers;
    } 
}
