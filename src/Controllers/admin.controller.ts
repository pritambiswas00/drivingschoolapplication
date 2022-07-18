import { Controller, Post, Body, Get, Patch, Delete, Session, UseInterceptors, UseGuards, HttpStatus, Param} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from '../Services/admin.service';
import { Admin } from 'src/Entity/admin.model';
import { IsAdmin } from 'src/Decorators/isAdmin.decorator';
import { IsAdminInterceptor } from 'src/Interceptors/isAdmin.interceptor';
import { AdminGuard } from 'src/Guards/isAdmin.guard';
import { AddAdmin, CreateScheduleByAdmin, CreateTrainer, CreateUser, DeleteScheduleByAdmin, DeleteTrainer, UpdateScheduleByAdmin, UpdateTrainer, UpdateUser } from 'src/Dtos/admin.dtos';
import { ObjectId } from 'mongodb';


@ApiTags("Admin")
@Controller('admin')
@UseInterceptors(IsAdminInterceptor)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post("/login")
    async login(@Body() body: AddAdmin, @Session() session: any) {
        const admin= await this.adminService.login(body);
        session.adminId = admin._id;
        const { _id, email } = admin;
        return {
            id: _id,
            email: email
        }
    }

    @Post("/logout")
    @UseGuards(AdminGuard)
    async logout(@Session() session: any) {
         return this.adminService.logout(session);
    }
    

    @Post("/addUser")
    @UseGuards(AdminGuard)
    async createUser(@Body() body: CreateUser, @IsAdmin() admin : Admin) {
           const user = await this.adminService.createUser(body);
           const { name, email, schedules } = user;
           return {
              name,
              email,
              schedules
           }
    }

    @Get("/getAllUsers")
    @UseGuards(AdminGuard)
    async getAllUsers() {
         return this.adminService.getAllUsers()
    }

    @Patch("/editUser/:userId")
    @UseGuards(AdminGuard)
    async editUser(@Param("userId") userId: ObjectId, @Body() body: UpdateUser) {
         return this.adminService.editUser(body, userId);   
    }

    @Delete("/deleteUser/:userId")
    @UseGuards(AdminGuard)
    async deleteUser(@Param("userId") userId: ObjectId) {
         return this.adminService.deleteUser(userId);
    }

    @Post("/addTrainer")
    @UseGuards(AdminGuard)
    async addTrainer (@Body() body: CreateTrainer) {
         return this.adminService.addTrainer(body);
    }

    @Patch("/editTrainer")
    @UseGuards(AdminGuard)
    async editTrainer (@Body() body: UpdateTrainer) {
          return this.adminService.editTrainer(body);
    }

    @Delete("/deleteTrainer")
    @UseGuards(AdminGuard)
    async deleteTrainer (@Body() body: DeleteTrainer) {
            const trainer = await this.adminService.deleteTrainer(body.trainerid);
            const { trainername } = trainer;
            return {
                  status: HttpStatus.OK,
                  message: `Trainer ${trainername} deleted successfully`
            }
    }

    @Get("/getAllTrainers") 
    @UseGuards(AdminGuard)
    async getAllTrainers () {
         return this.adminService.getAllTrainers();
    }

    @ApiOperation({ summary: 'Admin Create Schedule *' })
    @Post("/schedule/create")
    @UseGuards(AdminGuard)
    async createSchedule(@Body() body: CreateScheduleByAdmin, @IsAdmin() admin: Admin, @Session() session: any) {
          return this.adminService.createSchedule(body);
    }

    @ApiOperation({ summary: 'Admin Edit Schedule *' })
    @Patch("/schedule/edit")
    @UseGuards(AdminGuard)
    async updateSchedule(@Body() body: UpdateScheduleByAdmin, @IsAdmin() admin: Admin) {
          return this.adminService.editSchedule(body);
    }


    @ApiOperation({ summary: 'Admin Delete Schedule *' })
    @Delete("/schedule/edit")
    @UseGuards(AdminGuard)
    async deleteSchedule(@Body() body: DeleteScheduleByAdmin, @IsAdmin() admin: Admin) {
          return this.adminService.deleteSchedule(body);
    }
}
