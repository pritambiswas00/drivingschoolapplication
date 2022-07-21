import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { Admin, AdminDocument } from 'src/Entity/admin.model';
import { UserService } from './user.service';
import { AdminSignIn, CreateScheduleByAdmin, CreateUser, DeleteScheduleByAdmin, TrainerStatus, UpdateScheduleByAdmin, UpdateUser } from 'src/Dtos/admin.dtos';
import { scrypt as _scrypt } from "crypto";
import { UtilService } from 'src/Utils/Utils';
import { TrainerService } from './trainer.service';
import { ObjectId } from 'mongodb';
import { User } from 'src/Entity/user.model';
import { TrainerCreate, TrainerUpdate } from 'src/Dtos/trainer.dto';



@Injectable()
export class AdminService {
     constructor(@InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>, private readonly userService: UserService, private readonly utilService: UtilService, private readonly trainerService: TrainerService) { }

     async login(admin: AdminSignIn){
          const isAdminExist = await this.adminModel.findOne({ email: admin.email });
          if (!isAdminExist) {
               throw new NotFoundException(`Email ${admin.email} doesnot exist.`)
          }
          const isMatched = await this.utilService.comparePassword(admin.password, isAdminExist.password)
          if (!isMatched) {
               throw new BadRequestException("Password did not match.")
          }
          return isAdminExist;
     }

     async logout(session?: any) {
          //console.log(session, "session")
          if (session === undefined) {
               throw new BadRequestException("You are not logged in.")
          }

          session.adminId = null;
          return "You have successfully logged out."
     }

     async findAdminById(id: ObjectId):Promise<Admin> {
          return this.adminModel.findOne({ _id: id });
     }

     async createUser(user: CreateUser):Promise<User> {
          let isUserExist = await this.userService.findUserByEmail(user.email);
          if (isUserExist) {
               throw new BadRequestException(`User ${user.email} already exists`);
          }
          const hashedPassword = await this.utilService.hashPassword(user.password);
          user.password = hashedPassword;
          isUserExist = await this.userService.create(user);
          return isUserExist;
     }

     async getAllUsers() :Promise<User[]>{
          const allUsers = await this.userService.findAllUsers();
          if (!allUsers) {
               throw new NotFoundException("No users found.");
          }
          return allUsers;
     }

     async editUser(user: UpdateUser, userId: ObjectId):Promise<User>{
          const updatedUser = await this.userService.updateUser(user, userId);
          if(!updatedUser){
             throw new BadRequestException("Could not update user.")
          }
          return updatedUser;
   }

     async deleteUser(userId: ObjectId):Promise<User>{
        const deletedUser = await this.userService.userDelete(userId);
        if(!deletedUser){
             throw new BadRequestException("Could not delete user.");
        }

        return deletedUser;
     }

     async createSchedule(userschedule: CreateScheduleByAdmin) {
          const { userid, schedule } = userschedule;
          const newSchedule = await this.userService.createSchedule(schedule, userid);
          return newSchedule;
     }

     async deleteSchedule(userschedule: DeleteScheduleByAdmin) {
          return this.userService.deleteSchedule(userschedule.scheduleid, userschedule.userid);
     }

     async editSchedule(userschedule: UpdateScheduleByAdmin) {
          const { userid, scheduledetails } = userschedule;
          const updatedSchedule = await this.userService.editSchedule(scheduledetails, userid);
          return {
               status: HttpStatus.OK,
               schedule: updatedSchedule
          }
     }

     async addTrainer(newtrainer: TrainerCreate) {
          let trainerExist = await this.trainerService.findTrainerBasedOnEmailAndPhone(newtrainer.email, newtrainer.phonenumber);
          if (trainerExist) {
               throw new BadRequestException(`Trainer already exists.`);
          }
          trainerExist = await this.trainerService.create(newtrainer);
          return {
               status: HttpStatus.CREATED,
               trainer: trainerExist
          }
     }

     async editTrainer(trainerdetails: TrainerUpdate, trainerId: ObjectId) {
          const editedTrainer = await this.trainerService.editTrainer(trainerdetails, trainerId);
          return editedTrainer;
     }

     async deleteTrainer(trainerid: ObjectId) {
           const isTrainerExist = await this.trainerService.findOneById(trainerid);
           if(!isTrainerExist){
               throw new NotFoundException("Trainer not found.");
           }
           const removeTrainer = await this.trainerService.deleteTrainer(trainerid);
           return removeTrainer;
     }

     async getAllTrainers() {
           const trainers = await this.trainerService.getAllTrainer();
           if(!trainers) {
               throw new NotFoundException("Trainers not found.");
           }
           return trainers;
     }

     async setTrainerStatus(trainerstatus: TrainerStatus){
         
     }

     
}
