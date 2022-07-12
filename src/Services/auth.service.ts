import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Session} from '@nestjs/common';
import { User } from 'src/Entity/user.model';
import { UtilService } from 'src/Utils/Utils';
import { CreateScheduleDto, DeleteSchduleDto, LoginUserDto, UpdateScheduleDto } from '../Dtos/auth.user.Dtos';
import { UserService }  from "./user.service";
@Injectable()
export class AuthService {
    constructor(private readonly userService : UserService, private readonly utils: UtilService) {}


    async login(userDetails : LoginUserDto) {
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
        console.log(session, "session")
        if(session === undefined) {
             throw new BadRequestException("You are not logged in.")
        }
        session.userId = null; 
    }

    createSchedule(schedule:CreateScheduleDto, userid: string){
            return this.userService.createSchedule(schedule, userid);
    }

    updateSchedule(schedule: UpdateScheduleDto, userid: string){
         return this.userService.editSchedule(schedule, userid);
    }

    deleteSchedule(schedule: DeleteSchduleDto, userid: string){
         return this.userService.deleteSchedule(schedule.id, userid);
    }

    getSchedules(userid: string) {
        return this.userService.getAllSchedules(userid);
    }

    getAllTrainers() {
        return this.userService.getAllTrainers();
    }
}
