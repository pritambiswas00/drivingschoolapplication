import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, Matches, IsObject } from "class-validator";
import { TrainerCreate, TrainerUpdate } from "./trainer.dto";
import { IsObjectId } from 'class-validator-mongo-object-id';

export class UpdateSchedule {

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
    

    @ApiProperty({ required: false, type : TrainerUpdate})
    @IsObject()
    @IsOptional()
    trainerdetails?: TrainerUpdate 
}

export class CreateSchedule {
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
    

    @ApiProperty({ required: true, type : TrainerCreate})
    @IsObject()
    @IsNotEmpty()
    trainerdetails: TrainerCreate 
}

export class DeleteSchdule {
    @ApiProperty({ required: true,  })
    @IsObjectId()
    @IsNotEmpty()
    id: string;
}