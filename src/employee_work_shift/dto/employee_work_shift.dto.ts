import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString} from "class-validator";

export class EmployeeWorkShiftDto {
    @ApiProperty({
        description: "The id of the employee",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    employee_id: number

    @ApiProperty({
        description: "The id of the shift",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    shift_id: number
}