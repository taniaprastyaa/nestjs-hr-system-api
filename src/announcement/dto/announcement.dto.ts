import { ApiProperty } from "@nestjs/swagger";
import { AnnouncementType } from "@prisma/client";
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
        example: "2024-03-04",
    })
    @IsString()
    @IsNotEmpty()
    date: string

    @ApiProperty({
        description: "The department of the announcement",
        enum: ['general', 'per_department'],
    })
    @IsString()
    @IsNotEmpty()
    announcement_type: AnnouncementType
}