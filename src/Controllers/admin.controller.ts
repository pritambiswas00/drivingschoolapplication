import { Controller, Post, Body, Get, Patch, Delete, Session, UseInterceptors, UseGuards} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from '../Services/admin.service';
import { CreateUserDto} from '../Dtos/auth.user.Dtos';
import { AddAdminDto } from 'src/Dtos/admin.dtos';
import { Admin } from 'src/Entity/admin.model';
import { IsAdmin } from 'src/Decorators/isAdmin.decorator';
import { IsAdminInterceptor } from 'src/Interceptors/isAdmin.interceptor';
import { AdminGuard } from 'src/Guards/isAdmin.guard';


@ApiTags("Admin")
@Controller('admin')
@UseInterceptors(IsAdminInterceptor)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post("/login")
    async login(@Body() body: AddAdminDto, @Session() session: any) {
        const admin= await this.adminService.login(body);
        session.adminId = admin._id;
        return admin;
    }

    @Post("/logout")
    async logout(@Session() session: any) {
         return this.adminService.logout(session);
    }
    

    @Post("/addUser")
    @UseGuards(AdminGuard)
    async createUser(@Body() body: CreateUserDto, @IsAdmin() admin : Admin) {
           console.log(body, "IN CREATE USER")
           const user = await this.adminService.createUser(body);
           const { name, email, schedules } = user;
           return {
              name,
              email,
              schedules
           }
    }

    @Get("/getAllUsers")
    async getAllUsers() {
        
    }

    @Post("/addTrainer")
    async addTrainer () {

    }

    @Patch("/editTrainer")
    async editTrainer () {

    }

    @Delete("/deleteTrainer")
    async deleteTrainer () {

    }

    @Get("/getAllTrainers") 
    async getAllTrainers () {

    }

}
