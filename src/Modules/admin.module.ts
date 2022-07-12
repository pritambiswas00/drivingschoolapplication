import { Module } from '@nestjs/common';
import { AdminController } from '../Controllers/admin.controller';
import { AdminService } from '../Services/admin.service';
import { UserService } from '../Services/user.service';
import { UtilService } from 'src/Utils/Utils';
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, AdminSchema } from 'src/Entity/admin.model';
import { User, UserSchema } from 'src/Entity/user.model';
import { IsAdminInterceptor } from 'src/Interceptors/isAdmin.interceptor';
import { Schedule, ScheduleSchema } from 'src/Entity/schedule.model';
import { ScheduleService } from 'src/Services/schedule.service';
import { ConfigService } from '@nestjs/config';
import { TrainerService } from 'src/Services/trainer.service';
import { Trainer, TrainerSchema } from 'src/Entity/trainer.model';
import { MailerService } from 'src/Utils/MailerService';

@Module({
  imports: [MongooseModule.forFeature([{name : Admin.name, schema : AdminSchema}, {name : User.name, schema : UserSchema}, {name : Schedule.name, schema : ScheduleSchema}, {name : Trainer.name, schema : TrainerSchema}])],
  controllers: [AdminController],
  providers: [AdminService, UserService, UtilService, IsAdminInterceptor, ScheduleService, ConfigService, TrainerService, MailerService]
})
export class AdminModule {}
