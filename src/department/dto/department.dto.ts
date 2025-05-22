import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DepartmentDto {
    @ApiProperty({
        description: "The name of the department",
        example: "Department Name",
    })
    @IsString()
    @IsNotEmpty()
    department_name: string

    @ApiProperty({
        description: "The description of the department",
        example: "This is department description",
    })
    @IsString()
    @IsNotEmpty()
    description: string
}