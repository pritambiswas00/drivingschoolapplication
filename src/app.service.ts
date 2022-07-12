import { BadRequestException, Body, Injectable, InternalServerErrorException, NotFoundException, Session } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin, AdminDocument } from "./Entity/admin.model";
import { AddAdminDto, AdminSignInDto, SearchAdminDto } from "./Dtos/admin.dtos";
import { ConfigService } from "@nestjs/config";
import { UtilService } from "./Utils/Utils";



@Injectable()
export class AppService {
    constructor(@InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>, private readonly configService:ConfigService, private readonly utilService: UtilService) {}


     login (@Body() superadmin: AdminSignInDto) {
         try{
            console.log(superadmin, "FROM THE SERVICE")
            const superAdminUsername = this.configService.get("SUPER_ADMIN_USERNAME");
            const superAdminPassword = this.configService.get("SUPER_ADMIN_PASSWORD");
           if(superadmin.email !== superAdminUsername) {
               throw new BadRequestException("Email didn't matched");
           }else if(superadmin.password !== superAdminPassword) {
              throw new BadRequestException("Password didn't matched");
           }
 
           return ["successfully authenticated.", {
            username: superAdminUsername,
            password : superAdminPassword
           }]
         }catch(error){
            throw new InternalServerErrorException(error);
         }
    }

    async getAllAdmins(){
         try{
           const admins = await this.adminModel.find({})
           return admins;
         }catch(error){
             throw new InternalServerErrorException(error);
         }
    }

    async addAdmin(admin: AddAdminDto) {
        try{
            const adminList = await this.adminModel.find({});
            if(adminList.length === 5){
                throw new BadRequestException("Admin can't be created. Max range of admin is 5");
            }
            let [isAdminExist] = adminList.filter((ele) => {
                        return ele.email === admin.email;
            })
            if(isAdminExist) {
                throw new BadRequestException("Email already exists.");
            }
             const hashedPassword = await this.utilService.hashPassword(admin.password);
             isAdminExist = new this.adminModel({ email : admin.email, password : hashedPassword });
             isAdminExist.save();
             return isAdminExist;
        }catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async deleteAdmin(admin: SearchAdminDto) {
        try{
          const isAdminExist = await this.adminModel.find({email: admin.email})
          if(!isAdminExist) {
              throw new NotFoundException("Email not found.")
          }
          await this.adminModel.deleteOne({email: admin.email});
          return `${admin.email} has successfully been deleted.`
        }catch(error){
            throw new InternalServerErrorException(error);
        }
    }
}