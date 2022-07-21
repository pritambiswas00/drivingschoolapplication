import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Render, Session, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
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
     
     @ApiOperation({ summary: 'Login SuperAdmin ****' })
     @Post("/login")
     async login(@Body() superadmin:AdminSignIn, @Session() session: any){
          const [messageString, superAdminUsername] = this.appService.login(superadmin);
          session.superadminusername = superAdminUsername;
          return{
               status: HttpStatus.OK,
               message: messageString
          }
     }

     @ApiOperation({ summary: 'Logout SuperAdmin ****' })
     @Post("/logout")
     @UseGuards(RootGuard)
     async logout(@Session() session?: any){
          session.superadminusername = null;
          return {
               message: "Successfully logged out."
          }
     }

     @ApiOperation({ summary: 'Get All Admins ****' })
     @Get("/getAllAdmins")
     @UseGuards(RootGuard)
     async getAllAdmins(){
         const admins = await this.appService.getAllAdmins();
         return admins;
     }

     @ApiOperation({ summary: 'Add Admin ****' })
     @Post("/addAdmin")
     @UseGuards(RootGuard)
     async addAdmin(@Body() admin: AddAdmin){
            return this.appService.addAdmin(admin);
     }

     @ApiOperation({ summary: 'Delete Admin ****' })
     @Delete("/deleteAdmin/:adminId")
     @UseGuards(RootGuard)
     async removeAdmin(@Param("adminId") param : ObjectId){
          return this.appService.deleteAdmin(param);
     }
}