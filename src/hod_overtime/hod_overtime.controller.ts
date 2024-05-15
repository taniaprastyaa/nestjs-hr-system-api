import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { HodOvertimeService } from "./hod_overtime.service";
import { HodOvertimeDto } from "./dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Hod Overtime")
@Controller('hod_overtimes')
export class HodOvertimeController{
    constructor(private overtimeService: HodOvertimeService) {}

    // Get all overtimes
    @ApiBearerAuth()
    @Get()
    getAllHodOvertimes(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.overtimeService.getAllEmployeeOvertimes(user_id);
    }

    // Get hod overtime by id
    @ApiBearerAuth()
    @Get(':id')
    getHodOvertime(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.overtimeService.getHodOvertimeById({id: Number(id)});
    }

    // Update hod overtime in database
    @ApiBearerAuth()
    @Put(':id')
    async updateHodOvertime(
        @Param('id') id: string,
        @Body() dto: HodOvertimeDto
    ) : Promise<ResponseFormatter> {
        return this.overtimeService.updateHodOvertime({
            where: {id: Number(id)},
            dto
        });
    }
}