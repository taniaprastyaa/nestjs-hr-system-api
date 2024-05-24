import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { GetCurrentUserId } from "src/common/decorators";
import { UploadDocument } from "src/common/decorators/upload-document.decorator";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { DepartmentDocumentService } from "./department_document.service";
import { CreateDepartmentDocumentDto, UpdateDepartmentDocumentDto } from "./dto";

@ApiTags("Department Document")
@Controller('department_document')
export class DepartmentDocumentController{
    constructor(private departmentDocumentService: DepartmentDocumentService) {}

    // Get all department documents
    @ApiBearerAuth()
    @Get()
    getAllDeparmentDocuments() : Promise<ResponseFormatter> {
        return this.departmentDocumentService.getAllDepartmentDocuments();
    }

    @ApiBearerAuth()
    @Get('department-document-per-department')
    getDeparmentDocumentsPerDepartment(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.departmentDocumentService.getDepartmentDocumentsPerDepartment(user_id);
    }

    // Get department document by id
    @ApiBearerAuth()
    @Get(':id')
    getDepartmentDocument(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.departmentDocumentService.getDepartmentDocumentById({id: Number(id)});
    }

    // Store department document to database
    @ApiBearerAuth()
    @Post()
    @UploadDocument('document_file', './assets/department_document')
    @ApiConsumes('multipart/form-data')
    @ApiBody({type: CreateDepartmentDocumentDto})
    async createDepartmentDocument(
        @GetCurrentUserId() user_id: number,
        @Body() dto: CreateDepartmentDocumentDto,
        @UploadedFile() document_file: Express.Multer.File,
    ) : Promise<ResponseFormatter> {
        dto.document_file = document_file.filename;
        return this.departmentDocumentService.createDepartmentDocument(dto, user_id);
    }

    // Update department document in database
    @ApiBearerAuth()
    @Patch(':id')
    @UploadDocument('document_file', './assets/department_document')
    @ApiConsumes('multipart/form-data')
    @ApiBody({type: UpdateDepartmentDocumentDto})
    async updateDepartmentDocument(
        @Param('id') id: string,
        @GetCurrentUserId() user_id: number,
        @Body() dto: UpdateDepartmentDocumentDto,
        @UploadedFile() document_file: Express.Multer.File,
    ) : Promise<ResponseFormatter> {
        if(document_file) {
            dto.document_file = document_file.filename;
        }

        return this.departmentDocumentService.updateDepartmentDocument({
            where: {id: Number(id)},
            dto,
            user_id
        })
    }

    // Delete department document in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteDepartmentDocument(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.departmentDocumentService.deleteDepartmentDocument({id: Number(id)});
    }
}