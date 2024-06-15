import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeaveRequestService {
    constructor(private prisma: PrismaService) {}

    // Get all leaveRequests
    async getAllLeaveRequest() : Promise<ResponseFormatter> {
        const leaveRequests = await this.prisma.client.leaveRequest.findMany({
            include: {
                employee: true,
            }
        });

        return ResponseFormatter.success(
            "Leave request fetched successfully",
            leaveRequests
        );
    }

    // Get leaveRequest by id
    async getLeaveRequestById(
        leaveRequestWhereUniqueInput: Prisma.LeaveRequestWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const leaveRequest = await this.prisma.client.leaveRequest.findUnique({
            where: leaveRequestWhereUniqueInput,
            include: {
                employee: true,
            }
        });

        return ResponseFormatter.success(
            "Leave request fetched successfully",
            leaveRequest
        );
    }
}
