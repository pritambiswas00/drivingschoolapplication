import { Controller, Inject, Get, Logger, Post, Body, Param, Patch, Delete, Session, UseInterceptors, UseGuards } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AuthService } from "../Services/auth.service";
import { CreateScheduleDto, DeleteSchduleDto, LoginUserDto, UpdateScheduleDto } from '../Dtos/auth.user.Dtos';
import { ConfigService } from '@nestjs/config';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/Entity/user.model';
import { IsUser } from 'src/Decorators/isUser.decorator';
import { IsUserInterceptor } from 'src/Interceptors/isUser.interceptor';
import { UserGuard } from 'src/Guards/isUser.guard';


@ApiTags("User")
@Controller('auth')
@UseInterceptors(IsUserInterceptor)
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, private readonly authService: AuthService, private readonly config: ConfigService
  ) { }
  //////////////Login User///////////////////////
  @ApiOperation({ summary: 'Login User *' })
  @ApiResponse({ status: 200, description: 'User Logged in' })
  @ApiResponse({ status: 403, description: 'Forbidden. Not Authenticated.' })
  @Post("/login")
  async login (@Body() body: LoginUserDto, @Session() session: any) {
    const user = await this.authService.login(body);
    session.userId = user._id;
    return user;
  }


  /////////////Logout User///////////////
  @ApiOperation({ summary: 'Logout User *' })
  @Post("/logout")
  async logout (@Session() session: any) {
    return this.authService.logout(session);
  }

  ///////////User Schedule Create///////////////
  @ApiOperation({ summary: 'Create Schedule *' })
  @Post("/user/schedule/create")
  @UseGuards(UserGuard)
  async createSchedule(@Body() body: CreateScheduleDto, @IsUser() user: User, @Session() session: any) {
        return this.authService.createSchedule(body, session.userId);
  }

  @ApiOperation({ summary: 'Get Schedules *' })
  @Get("/user/schedule")
  @UseGuards(UserGuard)
  async getSchedule(@Session() session: any) {
       return this.authService.getSchedules(session.userId);
  }

  @ApiOperation({ summary: 'Edit Schedule *' })
  @Patch("/user/schedule/edit")
  @UseGuards(UserGuard)
  async editSchedule(@Body() body:UpdateScheduleDto, @IsUser() user: User, @Session() session: any) {
        return this.authService.updateSchedule(body, session.userid);
  }

  @ApiOperation({ summary: 'Delete Schedule *' })
  @Delete("/user/schedule/delete")
  @UseGuards(UserGuard)
  async deleteSchedule(@Body() body : DeleteSchduleDto, @Session() session: any) {
       return this.authService.deleteSchedule(body, session.userid);
  }

}
