import { Controller, Post, Body, Get, Patch, Delete, Session, UseInterceptors, UseGuards, HttpStatus, Param} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from '../Services/admin.service';
import { Admin } from 'src/Entity/admin.model';
import { IsAdmin } from 'src/Decorators/isAdmin.decorator';
import { IsAdminInterceptor } from 'src/Interceptors/isAdmin.interceptor';
import { AdminGuard } from 'src/Guards/isAdmin.guard';
import { AddAdmin, CreateScheduleByAdmin, CreateUser, DeleteScheduleByAdmin, DeleteTrainer, UpdateScheduleByAdmin, UpdateUser } from 'src/Dtos/admin.dtos';
import { ObjectId } from 'mongodb';
import { TrainerCreate, TrainerUpdate } from 'src/Dtos/trainer.dto';


@ApiTags("Admin")
@Controller('admin')
@UseInterceptors(IsAdminInterceptor)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @ApiOperation({ summary: 'Login Admin ****' })
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

    @ApiOperation({ summary: 'Logout Admin ****' })
    @Post("/logout")
    @UseGuards(AdminGuard)
    async logout(@Session() session: any) {
         return this.adminService.logout(session);
    }
    

    @ApiOperation({ summary: 'Add User ****' })
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

    @ApiOperation({ summary: 'Get All Users ****' })
    @Get("/getAllUsers")
    @UseGuards(AdminGuard)
    async getAllUsers() {
         return this.adminService.getAllUsers()
    }

    @ApiOperation({ summary: 'Edit User ****' })
    @Patch("/editUser/:userId")
    @UseGuards(AdminGuard)
    async editUser(@Param("userId") userId: ObjectId, @Body() body: UpdateUser) {
         return this.adminService.editUser(body, userId);   
    }

    @ApiOperation({ summary: 'Delete User ****' })
    @Delete("/deleteUser/:userId")
    @UseGuards(AdminGuard)
    async deleteUser(@Param("userId") userId: ObjectId) {
         return this.adminService.deleteUser(userId);
    }

    @ApiOperation({ summary: 'Add Trainer ****' })
    @Post("/addTrainer")
    @UseGuards(AdminGuard)
    async addTrainer (@Body() body: TrainerCreate) {
         return this.adminService.addTrainer(body);
    }

    @ApiOperation({ summary: 'Edit Trainer ****' })
    @Patch("/editTrainer/:trainerId")
    @UseGuards(AdminGuard)
    async editTrainer (@Param("trainerId") trainerId : ObjectId,@Body() body: TrainerUpdate) {
          return this.adminService.editTrainer(body, trainerId);
    }

    @ApiOperation({ summary: 'Delete Trainer *' })
    @Delete("/deleteTrainer/:trainerId")
    @UseGuards(AdminGuard)
    async deleteTrainer (@Param("trainerId") trainerId: ObjectId) {
            const trainer = await this.adminService.deleteTrainer(trainerId);
            const { trainername } = trainer;
            return {
                  status: HttpStatus.OK,
                  message: `Trainer ${trainername} deleted successfully`
            }
    }

    @ApiOperation({ summary: 'Get All Trainers ' })
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
    @Patch("/edit/user/:userId/schedule/:scheduleId")
    @UseGuards(AdminGuard)
    async updateSchedule(@Body() body: UpdateScheduleByAdmin, @Param("userId") userId: ObjectId, @Param("scheduleId") scheduleId: ObjectId) {
          return this.adminService.editSchedule(body);
    }


    @ApiOperation({ summary: 'Admin Delete Schedule *' })
    @Delete("/delete/user/:userId/schedule/:scheduleId")
    @UseGuards(AdminGuard)
    async deleteSchedule(@Body() body: DeleteScheduleByAdmin, @IsAdmin() admin: Admin) {
          return this.adminService.deleteSchedule(body);
    }
}
