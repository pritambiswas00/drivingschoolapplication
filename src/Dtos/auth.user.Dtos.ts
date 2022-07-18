import { IsEmail, IsString, IsNotEmpty, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CreateSchedule, UpdateSchedule } from "./schedule.dtos";
import { ObjectId } from "mongodb";


export class LoginUser {
    
    @ApiProperty({ required : true })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email : string;
    

    @ApiProperty({ required : true })
    @IsString()
    @IsNotEmpty()
    password : string;

}

export class CreateScheduleByUser{
    @ApiProperty({ required : true, type: CreateSchedule })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    schedule : CreateSchedule;
}

export class UpdateScheduleByUser{
    @ApiProperty({ required : true, type: ObjectId })
    @IsString()
    @IsNotEmpty()
    scheduleid : ObjectId;

    @ApiProperty({ required : true, type : UpdateSchedule })
    @IsObject()
    @IsNotEmpty()
    schedule : UpdateSchedule;
}

export class DeleteSchduleByUser{
    @ApiProperty({ required : true, type: ObjectId })
    @IsString()
    @IsNotEmpty()
    scheduleid : ObjectId;
}















