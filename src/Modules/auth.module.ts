import { Module } from '@nestjs/common';
import { AuthController } from '../Controllers/auth.controller';
import { AuthService } from '../Services/auth.service';
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema, User } from '../Entity/user.model'; 
import { UserService } from '../Services/user.service';
import { UtilService } from 'src/Utils/Utils';
import { Schedule, ScheduleSchema } from 'src/Entity/schedule.model';
import { ScheduleService } from 'src/Services/schedule.service';
import { TrainerService } from 'src/Services/trainer.service';
import { Trainer, TrainerSchema } from 'src/Entity/trainer.model';
import { MailerService } from 'src/Utils/MailerService';

@Module({
  imports: [MongooseModule.forFeature([{name : User.name, schema : UserSchema}, {name : Schedule.name, schema : ScheduleSchema}, {name : Trainer.name, schema : TrainerSchema}])],
  controllers: [AuthController],
  providers: [AuthService, UserService, UtilService, ScheduleService, TrainerService, MailerService]
})
export class AuthModule {}
