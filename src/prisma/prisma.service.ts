import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaClientExtended } from './custom-prisma-client';
import {
  filterSoftDeleted,
  softDelete,
  softDeleteMany,
} from './prisma.extension';

@Injectable()
export class PrismaService extends PrismaClientExtended implements OnModuleInit, OnModuleDestroy{
    constructor(config : ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                }
            }
        })
    }

    async onModuleInit() {
        await this.$connect();
        this.$extends(softDelete) //adding extensions
        .$extends(softDeleteMany)
        .$extends(filterSoftDeleted);
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}
