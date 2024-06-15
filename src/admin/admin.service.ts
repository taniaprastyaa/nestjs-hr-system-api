import { BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import * as argon from 'argon2'

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    // Get all admins 
    async getAllAdmins() : Promise<ResponseFormatter> {
        const admins = await this.prisma.client.admin.findMany({
            include: {
              user: true,
            },
        });

        return ResponseFormatter.success(
            "Admins fetched successfully",
            admins
        )
    }

    // Get admin by id 
    async getAdminById(
        adminWhereUniqueInput: Prisma.AdminWhereUniqueInput,
    ): Promise<ResponseFormatter> {
        const admin = await this.prisma.client.admin.findUnique({
            where: adminWhereUniqueInput,
            include: {
                user: true,
            },
        });

        return ResponseFormatter.success(
            "Admin fetched successfully",
            admin
        )
    }

    // Store admin to database
    async createAdmin(dto: CreateAdminDto): Promise<ResponseFormatter>{
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    username : dto.username,
                    email : dto.email,
                    password : hash,
                    role : "Admin",
                },
            });

            const userId = await this.getUserLimit1();

            const admin = await this.prisma.admin.create({
                data: {
                    name : dto.name,
                    phone : dto.phone,
                    user_id : userId.id
                },
            });

            const userAdmin = {user, admin};
            
            return ResponseFormatter.success(
                "Admin created succesfully",
                userAdmin,
                201
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Admin already exist');
            }

            throw new InternalServerErrorException('Admin failed to create');
        }
    }

    // Update admin in database
    async updateAdmin(params: {
        where: Prisma.AdminWhereUniqueInput;
        dto: UpdateAdminDto;
    }) {
        try {
            const {dto, where} = params;
            const existingAdmin = await this.prisma.client.admin.findUnique({
                where,
                include : {
                    user: true
                }
            });

            const admin = await this.prisma.admin.update({
                where,
                data: {
                    name : dto.name,
                    phone : dto.phone
                },
            });

            const user = await this.prisma.user.update({
                where : {
                    id : existingAdmin.user_id
                },
                data: {
                    username : dto.username,
                    email : dto.email,
                    role : "Admin"
                },
            });

            const userAdmin = {user, admin};

            return ResponseFormatter.success(
                "Admin updated successfully",
                userAdmin
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Admin already exist');
            }

            throw new InternalServerErrorException('Admin failed to create');
        }
    }

    // Delete admin in database
    async deleteAdmin(where: Prisma.AdminWhereUniqueInput): Promise<ResponseFormatter> {
        try {
            const existingAdmin = await this.prisma.client.admin.findUnique({
                where,
                include : {
                    user: true
                }
            });

            const admin = await this.prisma.client.admin.delete({
                id: where.id,
            });

            const user = await this.prisma.client.user.delete({
                id : existingAdmin.user_id
            });

            const userAdmin = {user, admin};

            return ResponseFormatter.success(
                "Admin deleted successfully",
                userAdmin
            );
        } catch (err) {
            throw new InternalServerErrorException('Admin failed to delete');
        } 
    }

    async getUserLimit1() {
        return this.prisma.user.findFirst({
          orderBy: { id: 'desc' },
          take: 1,
        });
    }
}
