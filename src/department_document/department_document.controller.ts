import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { GetCurrentUserId } from "src/common/decorators";
import { UploadDocument } from "src/common/decorators/upload-document.decorator";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { DepartmentDocumentService } from "./department_document.service";
import { CreateDepartmentDocumentDto, UpdateDepartmentDocumentDto } from "./dto";

@ApiTags("Department Document")
@Controller('department_document')
export class DepartmentDocumentController{
    constructor(
        private departmentDocumentService: DepartmentDocumentService,
        private configService: ConfigService,
    ) {}

    private formatDocumentUrl(document) {
        return {
            ...document,
            document_file: `${this.configService.get('BASE_URL')}/assets/department_documents/${document.document_file}`,
        };
    }

    // Get all department documents
    @ApiBearerAuth()
    @Get()
    async getAllDeparmentDocuments() : Promise<ResponseFormatter> {
        const response = await this.departmentDocumentService.getAllDepartmentDocuments();
        response["data"] = response["data"].map(this.formatDocumentUrl.bind(this));
        return response;
    }

    @ApiBearerAuth()
    @Get('department-document-per-department')
    async getDeparmentDocumentsPerDepartment(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        const response = await this.departmentDocumentService.getDepartmentDocumentsPerDepartment(user_id);
        response["data"] = response["data"].map(this.formatDocumentUrl.bind(this));
        return response;
    }

    // Get department document by id
    @ApiBearerAuth()
    @Get(':id')
    async getDepartmentDocument(@Param('id') id: string) : Promise<ResponseFormatter> {
        const response = await this.departmentDocumentService.getDepartmentDocumentById({id: Number(id)});
        response["data"] = this.formatDocumentUrl(response["data"]);
        return response;
    }

    // Store department document to database
    @ApiBearerAuth()
    @Post()
    @UploadDocument('document_file', './assets/department_documents')
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
    @UploadDocument('document_file', './assets/department_documents')
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