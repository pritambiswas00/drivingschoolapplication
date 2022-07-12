import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateScheduleDto } from "src/Dtos/auth.user.Dtos";
import { Schedule, ScheduleDocument } from 'src/Entity/schedule.model';

@Injectable()
export class ScheduleService{
     constructor(@InjectModel(Schedule.name) private readonly scheduleModel: Model<ScheduleDocument>){}


     async create(schedule: CreateScheduleDto, id: string) {
             const newSchedule = new this.scheduleModel({
                 ...schedule,
                 userid: id
             });
             await newSchedule.save();
             return newSchedule;
     }

     async findSchedule(date?:string, scheduleid?: string, userid?: string){
        const schedule = await this.scheduleModel.findOne({date:date, _id: scheduleid, userid: userid });
        if(!schedule) return null;
          return schedule;
     }


     async deleteSchedule(id:string){
         const isSchduleExist = await this.scheduleModel.findOneAndDelete({
          _id: id
         });
         if(!isSchduleExist) return null;
         return isSchduleExist;
     }

     async getAllSchdulesByUserid(userid: string){
          const allSchedules = await this.scheduleModel.findOne({
               userid: userid
          });
          if(!allSchedules) return null;
          return allSchedules;
     }
}



