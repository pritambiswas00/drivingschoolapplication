import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsObject, IsOptional, IsPhoneNumber, IsEmail } from "class-validator";

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
    make : string;
 
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    model : string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    vin: string;
}

export class TrainerCreate {

    @ApiProperty({ required: true })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email : string;

    @ApiProperty({ required: true })
    @IsPhoneNumber()
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

export class TrainerUpdate {
    @ApiProperty({ required: false })
    @IsEmail()
    @IsString()
    @IsOptional()
    email?: string;
    
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    trainername ?: string;
    
    @ApiProperty({ required: false, type : String })
    @IsString()
    @IsOptional()
    make ?: string;

    @ApiProperty({ required: false, type : String })
    @IsString()
    @IsOptional()
    model ?: string;

    @ApiProperty({ required: false, type : String })
    @IsString()
    @IsOptional()
    vin ?: string;
}



