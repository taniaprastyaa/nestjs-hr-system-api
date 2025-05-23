import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto } from './dto';

@ApiTags("Admin")
@Controller('admins')
export class AdminController {
    constructor(private readonly adminService : AdminService) {}

    // Get all admins
    @ApiBearerAuth()
    @Get()
    getAllAdmins(): Promise<ResponseFormatter> {
        return this.adminService.getAllAdmins();
    }

    // Get admin by id
    @ApiBearerAuth()
    @Get(':id')
    getSubject(@Param('id') id: string): Promise<ResponseFormatter> {
        return this.adminService.getAdminById({id: Number(id)});
    }

    // Store admin to database
    @ApiBearerAuth()
    @Post()
    async createAdmin(
        @Body() dto: CreateAdminDto
    ): Promise<ResponseFormatter>{
        return this.adminService.createAdmin(dto);
    }

    // Update admin in database
    @ApiBearerAuth()
    @Put(':id')
    async updateAdmin(
        @Param('id') id: string,
        @Body() dto: UpdateAdminDto
    ) {
        return this.adminService.updateAdmin({where: {id: Number(id)}, dto})
    }

    // Delete subject in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteAdmin(@Param('id') id: string): Promise<ResponseFormatter> {
        return this.adminService.deleteAdmin({id: Number(id) });
    }
}
