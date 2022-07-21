import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {  ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../Entity/user.model';
import { DeleteSchduleByUser, UpdateScheduleByUser } from "../Dtos/auth.user.Dtos";
import { ScheduleService } from './schedule.service';
import { UtilService } from 'src/Utils/Utils';
import { TrainerService } from './trainer.service';
import { MailerService } from 'src/Utils/MailerService';
import { CreateUser, UpdateUser } from 'src/Dtos/admin.dtos';
import { CreateSchedule } from 'src/Dtos/schedule.dtos';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>, private readonly scheduleService: ScheduleService, private readonly configService: ConfigService, private readonly utilService: UtilService, private readonly trainerService: TrainerService, private readonly mailerService: MailerService){}
    
    async create(user : CreateUser) {
        try{
            const newUser = new this.userModel(user);
            await newUser.save();
            return newUser;
        }catch(error) {
            throw new InternalServerErrorException(error);
        }

    }

    findAllUsers(){
         return this.userModel.find({});
    }

    async updateUser(user: UpdateUser, userId: ObjectId):Promise<User>{
        console.log(user, userId)
        try{
           const isUserExist = await this.userModel.findOne({ _id: userId });
           if(!isUserExist){
               throw new NotFoundException(`User ${userId} does not exist`);
           }
           const updatedUserKeys = Object.keys(user);
           for(let i = 0; i < updatedUserKeys.length; i++){
                 switch(updatedUserKeys[i]){
                     case "password": 
                         const isMatched = await this.utilService.comparePassword(user[updatedUserKeys[i]], isUserExist.password);
                         if(isMatched){
                             throw new BadRequestException(`Password can not be matched with current one.`);
                         }
                         const hashedPassword = await this.utilService.hashPassword(user[updatedUserKeys[i]]);
                         isUserExist[updatedUserKeys[i]] = hashedPassword;
                         break;
                     case "name":
                     case "email":
                     case "endDate":
                         isUserExist[updatedUserKeys[i]] = user[updatedUserKeys[i]];
                         break;
                     default:
                         break;

                 }
           }
           const newDate:Date = new Date();
           isUserExist["updatedAt"] = newDate;
           await isUserExist.save();
           return isUserExist;
        }catch(error){
            throw new InternalServerErrorException(error)
        }
}

    async userDelete(userId: ObjectId):Promise<User> {
     const user = await this.userModel.findByIdAndDelete(userId);
     if(!user){
         throw new NotFoundException(`User ${userId} does not exist`);
     }
     return user;
    }

    findUserByEmail(email : string) {
        return this.userModel.findOne({ email: email });
    }

    findUserById(id : ObjectId) {
        return this.userModel.findOne({ _id: id});
    }

    async createSchedule(scheduleuser:CreateSchedule, userid: ObjectId){
        const { scheduledate, trainerdetails } = scheduleuser;
        const todaysDate = new Date();
        const scheduleDate = new Date(scheduledate);
        const todaysUnixDate = this.utilService.convertToUnix(todaysDate);
        const scheduleUnixDate = this.utilService.convertToUnix(scheduleDate);
        const scheduleDateLimit = +this.configService.get("SCHEDULE_DATE_LIMIT") * 24 * 60 * 60;
        const isScheduleExist = await this.scheduleService.findScheduleBasedOnDateAndUserId(scheduledate, userid);
        const isTrainerExist = await this.trainerService.findTrainerBasedOnEmail(trainerdetails.email); 
        if(scheduleUnixDate - todaysUnixDate > scheduleDateLimit){
            throw new BadRequestException(`Schedule must be ${this.configService.get("SCHEDULE_DATE_LIMIT")} days prior to today's date.`);
        }else if(isScheduleExist) {
            throw new BadRequestException(`Schedule with date ${scheduledate} is already scheduled.`);
        }else if(!isTrainerExist) {
            throw new NotFoundException(`Trainer not found.`);
        }
        const newSchedule = await this.scheduleService.create(scheduleuser,userid);
        return newSchedule;
    }

    async editSchedule(updateschedule: UpdateScheduleByUser, userid: ObjectId){
        const { scheduleid, schedule } = updateschedule;
        const isScheduleExist = await this.scheduleService.findScheduleBasedOnId(scheduleid);
        const isTrainerExist = await this.trainerService.findTrainerBasedOnEmail(schedule.trainerdetails.email);
        if(!isScheduleExist) throw new NotFoundException(`Schedule not found with date ${schedule.scheduledate}.`);
        else if(!isTrainerExist) throw new NotFoundException(`Trainer with email ${schedule.trainerdetails.email} not found.`)
        const updateKeys = Object.keys(schedule);
        updateKeys.forEach(key =>{
            isScheduleExist[key] = schedule[key];
        });
        await isScheduleExist.save();
        return isScheduleExist;
    }

    async deleteSchedule(id:ObjectId, userid: ObjectId){    
         let isSchduleExist = await this.scheduleService.findScheduleBasedOnScheduleIdAndUserId(id, userid);
         if(!isSchduleExist) throw new NotFoundException(`Schedule not found.`);
         isSchduleExist = await this.scheduleService.deleteSchedule(id);
         return isSchduleExist; 
    }

    async getAllSchedules(userid: ObjectId){
         const allSchedules = await this.scheduleService.getAllSchdulesByUserid(userid);
         if(!allSchedules) throw new NotFoundException(`Schedule not found for the user.`);
         return allSchedules;
    }

    async getAllTrainers() {
       return this.trainerService.getAllTrainer(); 
    }



}