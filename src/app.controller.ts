import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Render, Session, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ObjectId } from "mongodb";
import { AppService } from "./app.service";
import { AddAdmin, AdminSignIn, SearchAdmin } from "./Dtos/admin.dtos";
import { RootGuard } from "./Guards/isRoot.guard";
import { IsRootInterceptor } from "./Interceptors/isRoot.interceptor";



@ApiTags("Root")
@Controller("root")
@UseInterceptors(IsRootInterceptor)
export class AppController {
     constructor(private readonly appService: AppService) {}
     
     @Post("/login")
     async login(@Body() superadmin:AdminSignIn, @Session() session: any){
          const [messageString, superAdminUsername] = this.appService.login(superadmin);
          session.superadminusername = superAdminUsername;
          return{
               status: HttpStatus.OK,
               message: messageString
          }
     }

     @Post("/logout")
     @UseGuards(RootGuard)
     async logout(@Session() session?: any){
          session.superadminusername = null;
          return {
               message: "Successfully logged out."
          }
     }

     @Get("/getAllAdmins")
     @UseGuards(RootGuard)
     async getAllAdmins(){
         const admins = await this.appService.getAllAdmins();
         return admins;
     }

     @Post("/addAdmin")
     @UseGuards(RootGuard)
     async addAdmin(@Body() admin: AddAdmin){
            return this.appService.addAdmin(admin);
     }

     @Delete("/deleteAdmin/:adminId")
     @UseGuards(RootGuard)
     async removeAdmin(@Param("adminId") param : ObjectId){
          return this.appService.deleteAdmin(param);
     }
}