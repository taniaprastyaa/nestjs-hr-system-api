import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString} from "class-validator";

export class WorkShiftDto {
    @ApiProperty({
        description: "The name of the work shift",
        example: "Morning Shift",
    })
    @IsString()
    @IsNotEmpty()
    shift_name: string

    @ApiProperty({
        description: "The start time of the work shift",
        example: "08:00:00",
    })
    @IsString()
    @IsNotEmpty()
    start_time: string

    @ApiProperty({
        description: "The end time of the work shift",
        example: "16:00:00",
    })
    @IsString()
    @IsNotEmpty()
    end_time: string
}