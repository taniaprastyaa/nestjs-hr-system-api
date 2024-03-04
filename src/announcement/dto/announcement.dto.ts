import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AnnouncementDto {
    @ApiProperty({
        description: "The title of the announcement",
        example: "Announcement",
    })
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({
        description: "The content of the announcement",
        example: "This is announcement content",
    })
    @IsString()
    @IsNotEmpty()
    content: string

    @ApiProperty({
        description: "The date of the announcement",
        example: "Announcement",
    })
    @IsString()
    @IsNotEmpty()
    date: string

    @ApiProperty({
        description: "The department of the announcement",
        example: 0,
    })
    @IsNumber()
    @IsNotEmpty()
    department_id: number
}