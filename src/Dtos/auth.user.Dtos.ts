import { IsEmail, IsString, IsNotEmpty, IsPhoneNumber, IsOptional, IsAlphanumeric, Matches, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateUserDto {

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


export class LoginUserDto {
    
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

export class CarDto {

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty() 
    make : string;
 
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    model : string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    vin : string;
}

export class UpdateCarDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    make ?: string;
 
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    model ?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    vin ?: string;
}

export class TrainerDto {

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    email : string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    phonenumber : string;
    
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    trainername : string;
    
    @ApiProperty({ required: true, type : CarDto })
    @IsObject()
    @IsNotEmpty()
    cardetails : CarDto
}

export class UpdateScheduleDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    id: string;


    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    schedulename?: string;
    
    @ApiProperty({ required: false })
    @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(20)\d{2}$/, {message : "Date must be MM/DD/YYYY"})
    @IsString()
    @IsOptional()
    scheduledate? : string;
    
    @ApiProperty({ required: false })
    @Matches(/^[0-2][0-2]:[0-5][0-9]$/gm, {message : "Time must be HH:MM"})
    @IsString()
    @IsOptional()
    scheduletime? : string;
    

    @ApiProperty({ required: false, type : TrainerDto})
    @IsObject()
    @IsOptional()
    trainerdetails?: TrainerDto 
}

export class CreateScheduleDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    schedulename: string;
    
    @ApiProperty({ required: true })
    @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(20)\d{2}$/, {message : "Date must be MM/DD/YYYY"})
    @IsString()
    @IsNotEmpty()
    scheduledate : string;
    
    @ApiProperty({ required: true })
    @Matches(/^[0-2][0-2]:[0-5][0-9]$/gm, {message : "Time must be HH:MM"})
    @IsString()
    @IsNotEmpty()
    scheduletime : string;
    

    @ApiProperty({ required: true, type : TrainerDto})
    @IsObject()
    @IsNotEmpty()
    trainerdetails: TrainerDto 
}

export class DeleteSchduleDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    id: string;
}













