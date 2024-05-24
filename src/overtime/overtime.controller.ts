import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { OvertimeService } from "./overtime.service";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Overtime")
@Controller('overtimes')
export class OvertimeController{
    constructor(private overtimeService: OvertimeService) {}

    // Get all overtimes
    @ApiBearerAuth()
    @Get()
    getAllOvertimes(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.overtimeService.getAllEmployeeOvertimes();
    }

    // Get  overtime by id
    @ApiBearerAuth()
    @Get(':id')
    getOvertime(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.overtimeService.getOvertimeById({id: Number(id)});
    }
}