import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateAdminDto {
    @ApiProperty({
        description: "The name of the admin",
        example: "Admin",
    })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        description: "The username of the admin",
        example: "admin",
    })
    @IsString()
    @IsNotEmpty()
    username: string

    @ApiProperty({
        description: "The email of the admin",
        example: "admin@gmail.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: "The phone number of the admin",
        example: "085954096871",
    })
    @IsString()
    @IsNotEmpty()
    phone: string
}