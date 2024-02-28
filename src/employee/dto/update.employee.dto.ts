import { ApiProperty } from "@nestjs/swagger"
import { EmployeeStatus, Gender, UserRole } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateEmployeeDto {
    @ApiProperty({
        description: "The name of the employee",
        example: "John Doe",
    })
    @IsString()
    @IsNotEmpty()
    full_name: string

    @ApiProperty({
        description: "The email of the employee",
        example: "johndoe@gmail.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: "The username of the employee",
        example: "johndoe",
    })
    @IsString()
    @IsNotEmpty()
    username: string

    @ApiProperty({
        description: "The role of the employee",
        enum: ['HOD', 'Employee'],
    })
    @IsString()
    @IsNotEmpty()
    role: UserRole

    @ApiProperty({
        description: "The phone number of the employee",
        example: "085954096871",
    })
    @IsString()
    @IsNotEmpty()
    phone: string

    @ApiProperty({
        description: "The address of the employee",
        example: "Odelia Roav Road",
    })
    @IsString()
    @IsNotEmpty()
    address: string

    @ApiProperty({
        description: "The employee's birth date",
        example: "2005-04-12",
    })
    @IsString()
    @IsNotEmpty()
    date_of_birth: string

    @ApiProperty({
        description: "The gender of the employee",
        enum: ['Male', 'Female'],
    })
    @IsString()
    @IsNotEmpty()
    gender: Gender

    @ApiProperty({
        description: "The work entry date of the employee",
        example: "2005-04-12",
    })
    @IsString()
    @IsNotEmpty()
    work_entry_date: string

    @ApiProperty({
        description: "The status of the employee",
        enum: ['Contract', 'Permanent'],
    })
    @IsString()
    @IsNotEmpty()
    employee_status: EmployeeStatus

    @ApiProperty({
        description: "The department of the employee",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    department_id: number

    @ApiProperty({
        description: "The position of the employee",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    position_id: number
}