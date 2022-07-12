import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {  ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../Entity/user.model';
import { CreateScheduleDto, CreateUserDto, UpdateScheduleDto } from "../Dtos/auth.user.Dtos";
import { ScheduleService } from './schedule.service';
import { UtilService } from 'src/Utils/Utils';
import { TrainerService } from './trainer.service';
import { MailerService } from 'src/Utils/MailerService';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>, private readonly scheduleService: ScheduleService, private readonly configService: ConfigService, private readonly utilService: UtilService, private readonly trainerService: TrainerService, private readonly mailerService: MailerService){}
    
    async create(user : CreateUserDto) {
        try{
            const newUser = new this.userModel(user);
            await newUser.save();
            return newUser;
        }catch(error) {
            throw new InternalServerErrorException(error);
        }

    }

    findUserByEmail(email : string) {
        return this.userModel.findOne({ email: email });
    }

    findUserById(id : string) {
        return this.userModel.findOne({ _id: id});
    }

    async createSchedule(schedule:CreateScheduleDto, userid: string){
        const  { scheduledate, trainerdetails } = schedule;
        const todaysDate = new Date();
        const scheduleDate = new Date(scheduledate);
        const todaysUnixDate = this.utilService.convertToUnix(todaysDate);
        const scheduleUnixDate = this.utilService.convertToUnix(scheduleDate);
        const scheduleDateLimit = +this.configService.get("SCHEDULE_DATE_LIMIT") * 24 * 60 * 60;
        const isScheduleExist = await this.scheduleService.findSchedule(scheduledate, userid);
        const isTrainerExist = await this.trainerService.findTrainerBasedOnEmail(trainerdetails.email); 
        if(scheduleUnixDate - todaysUnixDate > scheduleDateLimit){
            throw new BadRequestException(`Schedule must be ${this.configService.get("SCHEDULE_DATE_LIMIT")} days prior to today's date.`);
        }else if(isScheduleExist) {
            throw new BadRequestException(`Schedule with date ${scheduledate} is already scheduled.`);
        }else if(!isTrainerExist) {
            throw new NotFoundException(`Trainer not found.`);
        }
        const newSchedule = await this.scheduleService.create(schedule,userid);
        return newSchedule;
    }

    async editSchedule(schedule: UpdateScheduleDto, userid: string){
        const isScheduleExist = await this.scheduleService.findSchedule(schedule.scheduledate, schedule.id, userid);
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

    async deleteSchedule(schduleid: string, userid: string){
         let isSchduleExist = await this.scheduleService.findSchedule(schduleid, userid);
         if(!isSchduleExist) throw new NotFoundException(`Schedule not found.`);
         isSchduleExist = await this.scheduleService.deleteSchedule(schduleid);
         return isSchduleExist; 
    }

    async getAllSchedules(userid: string){
         const allSchedules = await this.scheduleService.getAllSchdulesByUserid(userid);
         if(!allSchedules) throw new NotFoundException(`Schedule not found for the user.`);
         return allSchedules;
    }

    async getAllTrainers() {
       return this.trainerService.getAllTrainer(); 
    }

}