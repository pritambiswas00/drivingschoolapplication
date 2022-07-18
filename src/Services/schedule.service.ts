import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { CreateSchedule } from "src/Dtos/schedule.dtos";
import { Schedule, ScheduleDocument } from 'src/Entity/schedule.model';

@Injectable()
export class ScheduleService{
     constructor(@InjectModel(Schedule.name) private readonly scheduleModel: Model<ScheduleDocument>){}


     async create(schedule: CreateSchedule, id: ObjectId) {
             const newSchedule = new this.scheduleModel({
                 ...schedule,
                 userid: id
             });
             await newSchedule.save();
             return newSchedule;
     }

     async findSchedule(date?:string, scheduleid?: ObjectId, userid?: ObjectId){
        const schedule = await this.scheduleModel.findOne({date:date, _id: scheduleid, userid: userid });
        if(!schedule) return null;
          return schedule;
     }

     async findScheduleBasedOnDateAndUserId(date: string, userid: ObjectId){
          const schedule = await this.scheduleModel.findOne({date:date, userid: userid });
          if(!schedule) return null;
            return schedule;
     }

     async findScheduleBasedOnId(scheduleid: ObjectId) {
         const schedule = await this.scheduleModel.findOne({ _id: scheduleid });
         if(!schedule) return null;
         return schedule;
     }

     async findScheduleBasedOnScheduleIdAndUserId(scheduleid:ObjectId , userid : ObjectId) {
          const schedule = await this.scheduleModel.findOne({_id: scheduleid, userid: userid});
          if(!schedule) return null;
          return schedule;
     }


     async deleteSchedule(id:ObjectId){
         const isSchduleExist = await this.scheduleModel.findOneAndDelete({
          _id: id
         });
         if(!isSchduleExist) return null;
         return isSchduleExist;
     }

     async getAllSchdulesByUserid(userid: ObjectId){
          const allSchedules = await this.scheduleModel.findOne({
               userid: userid
          });
          if(!allSchedules) return null;
          return allSchedules;
     }
}



