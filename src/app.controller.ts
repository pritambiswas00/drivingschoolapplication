import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Render, Session } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { AddAdminDto, AdminSignInDto, SearchAdminDto } from "./Dtos/admin.dtos";



@ApiTags("Root")
@Controller("root")
export class AppController {
     constructor(private readonly appService: AppService) {}
     
     @Post("/login")
     async login(@Body() superadmin:AdminSignInDto, @Session() session: any){
          const [messageString, superadmindetails] = this.appService.login(superadmin);
          session.superadmindetails = superadmindetails;
          return{
               status: HttpStatus.OK,
               message: messageString
          }
     }

     @Post("/logout")
     async logout(@Session() session?: any){
          if(!session){
               throw new BadRequestException("You are not logged.")
          }
          session.superadmindetails = null;
          return {
               message: "Successfully logged out."
          }
     }

     @Get("/getAllAdmins")
     async getAllAdmins(@Session() session?:any){
          if(!session){
               throw new BadRequestException("You are not authorized");
          }
         const admins = await this.appService.getAllAdmins();
         return admins;
     }

     @Post("/addAdmin")
     async addAdmin(@Body() admin: AddAdminDto, @Session() session?: any){
          if(!session){
               throw new BadRequestException("You are not authorized");
          }
            return this.appService.addAdmin(admin);
     }

     @Delete("/deleteAdmin")
     async removeAdmin(@Body() body: SearchAdminDto, @Session() session?: any ){
          if(!session){
               throw new BadRequestException("You are not authorized");
          }
          return this.appService.deleteAdmin(body);
     }
}