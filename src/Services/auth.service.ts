import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Session} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CreateSchedule } from 'src/Dtos/schedule.dtos';
import { User } from 'src/Entity/user.model';
import { UtilService } from 'src/Utils/Utils';
import { CreateScheduleByUser, DeleteSchduleByUser, LoginUser, UpdateScheduleByUser } from '../Dtos/auth.user.Dtos';
import { UserService }  from "./user.service";
@Injectable()
export class AuthService {
    constructor(private readonly userService : UserService, private readonly utils: UtilService) {}


    async login(userDetails : LoginUser) {
        const isUserExist = await this.userService.findUserByEmail(userDetails.email);
        if(!isUserExist) {
            throw new NotFoundException("User does not exist.")
        }
        const isMatched = await this.utils.comparePassword(userDetails.password, isUserExist.password);
        if(!isMatched){
            throw new BadRequestException("Password didnot match.");
        }
        return isUserExist; 
    }

    async logout (session? : any) {
        //console.log(session, "session")
        if(session === undefined) {
             throw new BadRequestException("You are not logged in.")
        }
        session.userId = null; 
    }

    createSchedule(schedule:CreateSchedule, userid: ObjectId){
            return this.userService.createSchedule(schedule, userid);
    }

    updateSchedule(schedule: UpdateScheduleByUser, userid: ObjectId){
         return this.userService.editSchedule(schedule, userid);
    }

    deleteSchedule(schedule: DeleteSchduleByUser, userid: ObjectId){
        const { scheduleid } = schedule;
         return this.userService.deleteSchedule(scheduleid, userid);
    }

    getSchedules(userid: ObjectId) {
        return this.userService.getAllSchedules(userid);
    }

    getAllTrainers() {
        return this.userService.getAllTrainers();
    }
}
