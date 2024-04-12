import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class SignupDto {
    @ApiProperty({
        description: "The username of the user",
        example: "username",
    })
    @IsString()
    @IsNotEmpty()
    username: string

    @ApiProperty({
        description: "The email of the user",
        example: "emailaddress@gmail.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: "The password of the user",
        example: "super-secret",
    })
    @IsString()
    @IsNotEmpty()
    password: string
}

export class SigninDto {
    @ApiProperty({
        description: "The email of the user",
        example: "emailaddress@gmail.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: "The password of the user",
        example: "super-secret",
    })
    @IsString()
    @IsNotEmpty()
    password: string
}