import { BadRequestException, Body, Injectable, InternalServerErrorException, NotFoundException, Session } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin, AdminDocument } from "./Entity/admin.model";
import { AddAdmin, AdminSignIn, SearchAdmin } from "./Dtos/admin.dtos";
import { ConfigService } from "@nestjs/config";
import { UtilService } from "./Utils/Utils";
import { ObjectId } from "mongodb";



@Injectable()
export class AppService {
    constructor(@InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>, private readonly configService:ConfigService, private readonly utilService: UtilService) {}


     login (@Body() superadmin: AdminSignIn) {
         try{
            // console.log(superadmin, "FROM THE SERVICE")
            const superAdminUsername = this.configService.get("SUPER_ADMIN_USERNAME");
            const superAdminPassword = this.configService.get("SUPER_ADMIN_PASSWORD");
           if(superadmin.email !== superAdminUsername) {
               throw new BadRequestException("Email didn't matched");
           }else if(superadmin.password !== superAdminPassword) {
              throw new BadRequestException("Password didn't matched");
           }
 
           return ["successfully authenticated.",superAdminUsername]
         }catch(error){
            throw new InternalServerErrorException(error);
         }
    }

    async getAllAdmins(){
         try{
           const admins = await this.adminModel.find({});
           let modifiedAdmins = [];
           for(let i = 0; i < admins.length; i++) {
                modifiedAdmins.push({
                    id: admins[i]._id,
                    email: admins[i].email
                })
           };
           return modifiedAdmins;
         }catch(error){
             throw new InternalServerErrorException(error);
         }
    }

    async addAdmin(admin: AddAdmin) {
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
    }

    async deleteAdmin(id: ObjectId) {
        try{
          const isAdminExist = await this.adminModel.find({_id: id})
          if(!isAdminExist) {
              throw new NotFoundException("ID not found.")
          }
          await this.adminModel.deleteOne({_id:id});
          return `${id} has successfully been deleted.`
        }catch(error){
            throw new InternalServerErrorException(error);
        }
    }
}