import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDepartmentDocumentDto {
    @ApiProperty({
        description: "The name of the department document",
        example: "Document Name",
    })
    @IsString()
    @IsNotEmpty()
    document_name: string

    @ApiProperty({
        format: "binary",
        description: "The file of the department document",
    })
    @IsString()
    @IsOptional()
    document_file: string

    @ApiProperty({
        description: "The description of the department document",
        example: "This is department document description",
    })
    @IsString()
    @IsNotEmpty()
    description: string
}