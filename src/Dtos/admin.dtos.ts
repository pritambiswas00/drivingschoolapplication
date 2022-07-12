import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class SearchAdminDto {
    @ApiProperty({ required : true })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string
}
export class AddAdminDto {

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

export class AdminSignInDto {
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