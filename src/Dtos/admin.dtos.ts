import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty, IsAlphanumeric, IsOptional, IsPhoneNumber, Matches, IsObject, IsBoolean } from "class-validator";
import { IsObjectId } from 'class-validator-mongo-object-id';
import { ObjectId } from "mongodb";
import { UpdateScheduleByUser } from "./auth.user.Dtos";
import { CreateSchedule } from "./schedule.dtos";
import { TrainerCreate, TrainerUpdate } from "./trainer.dto";

export class SearchAdmin {
    @ApiProperty({ required : true, type: ObjectId })
    @IsString()
    @IsNotEmpty()
    adminid: ObjectId
}
export class AddAdmin {

    @ApiProperty({ required : true })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({ required : true })
    @IsString()
    @IsNotEmpty()
    password : string;

}

export class AdminSignIn {
    @ApiProperty({ required : true })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({ required : true })
    @IsString()
    @IsNotEmpty()
    password : string;
}

export class CreateUser {

    @ApiProperty({ required : true})
    @IsAlphanumeric()
    @IsString()
    @IsNotEmpty()
    billnumber : string;

    @ApiProperty({ required : true })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email : string;
    
    @ApiProperty({ required : true })
    @IsPhoneNumber()
    @IsString()
    @IsNotEmpty()
    phonenumber : string;

    @ApiProperty({ required : true })
    @IsString()
    @IsNotEmpty()
    name : string;

    @ApiProperty({ required : true })
    @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(20)\d{2}$/, {message : "Date must be MM/DD/YYYY"})
    @IsString()
    @IsNotEmpty()
    startDate : string;

    @ApiProperty({ required : false })
    @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(20)\d{2}$/, {message : "Date must be MM/DD/YYYY"})
    @IsString()
    @IsOptional()
    endDate? : string;

    @ApiProperty({ required : true })
    @IsString()
    @IsNotEmpty()
    password : string;
}

export class UpdateUser {

    @ApiProperty({ required : false})
    @IsAlphanumeric()
    @IsString()
    @IsOptional()
    billnumber : string;

    @ApiProperty({ required : false})
    @IsEmail()
    @IsString()
    @IsOptional()
    email : string;
    
    @ApiProperty({ required : false})
    @IsPhoneNumber()
    @IsString()
    @IsOptional()
    phonenumber : string;

    @ApiProperty({ required : false})
    @IsString()
    @IsOptional()
    name : string;

    @ApiProperty({ required : false})
    @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(20)\d{2}$/, {message : "Date must be MM/DD/YYYY"})
    @IsString()
    @IsOptional()
    startDate : string;

    @ApiProperty({ required : false })
    @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(20)\d{2}$/, {message : "Date must be MM/DD/YYYY"})
    @IsString()
    @IsOptional()
    endDate? : string;

    @ApiProperty({ required : false})
    @IsString()
    @IsOptional()
    password : string;
}

export class CreateScheduleByAdmin {
    @ApiProperty({ required : true, type: ObjectId })
    @IsString()
    @IsNotEmpty()
    userid: ObjectId
   
    @ApiProperty({ required : true , type: CreateSchedule})
    @IsObject()
    @IsNotEmpty()
    schedule: CreateSchedule
}

export class UpdateScheduleByAdmin {
    @ApiProperty({ required : true, type: ObjectId })
    @IsString()
    @IsNotEmpty()
    userid: ObjectId
   
    @ApiProperty({ required : true , type: UpdateScheduleByUser})
    @IsObject()
    @IsNotEmpty()
    scheduledetails: UpdateScheduleByUser

}

export class DeleteScheduleByAdmin{
    @ApiProperty({ required : true, type: ObjectId })
    @IsString()
    @IsNotEmpty()
    userid: ObjectId
   
    @ApiProperty({ required : true , type: ObjectId})
    @IsString()
    @IsNotEmpty()
    scheduleid: ObjectId
}

export class CreateTrainer{
    @ApiProperty({ required : true, type: TrainerCreate })
    @IsObject()
    @IsNotEmpty()
    trainer: TrainerCreate
}

export class UpdateTrainer{
    @ApiProperty({ required : true, type: ObjectId })
    @IsObjectId()
    @IsNotEmpty()
    trainerid: ObjectId

    @ApiProperty({ required : true, type: TrainerUpdate })
    @IsObject()
    @IsNotEmpty()
    trainer: TrainerUpdate
}

export class DeleteTrainer{
    @ApiProperty({ required : true, type:ObjectId })
    @IsObjectId()
    @IsNotEmpty()
    trainerid: ObjectId
}

export class TrainerStatus{
    @ApiProperty({ required : true, type: ObjectId })
    @IsObjectId()
    @IsNotEmpty()
    trainerid: ObjectId

    @ApiProperty({ required : true, type: Boolean })
    @IsBoolean()
    @IsNotEmpty()
    status: boolean
}
