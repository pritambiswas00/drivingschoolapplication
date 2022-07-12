import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/Entity/admin.model';
import { UserService } from './user.service';
import { AdminSignInDto } from 'src/Dtos/admin.dtos';
import { scrypt as _scrypt } from "crypto";
import { UtilService } from 'src/Utils/Utils';
import { CreateUserDto } from 'src/Dtos/auth.user.Dtos';


@Injectable()
export class AdminService {
    constructor(@InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>, private readonly userService: UserService, private readonly utilService : UtilService){}

    
    async login (admin: AdminSignInDto) {
         const isAdminExist = await this.adminModel.findOne({ email : admin.email });
         if(!isAdminExist) {
            throw new NotFoundException(`Email ${admin.email} doesnot exist.`)
         }
         const isMatched = await this.utilService.comparePassword(admin.password, isAdminExist.password)
         if(!isMatched){
              throw new BadRequestException("Password did not match.")
         }
         return isAdminExist;
    }

    async logout(session? : any) {
        console.log(session, "session")
         if(session === undefined) {
              throw new BadRequestException("You are not logged in.")
         }

         session.adminId = null; 
    }

    async findAdminById(id:string) {
        return await this.adminModel.findOne({ _id : id });
    }

    async createUser(user : CreateUserDto) {
         let isUserExist = await this.userService.findUserByEmail(user.email);
         if(isUserExist) {
            throw new BadRequestException(`User ${user.email} already exists`);
         }
         const hashedPassword = await this.utilService.hashPassword(user.password);
         user.password = hashedPassword;
         isUserExist = await this.userService.create(user);
         return isUserExist;
    }
}
