import { Module } from '@nestjs/common';
import { DepartmentDocumentController } from './department_document.controller';
import { DepartmentDocumentService } from './department_document.service';

@Module({
  controllers: [DepartmentDocumentController],
  providers: [DepartmentDocumentService]
})
export class DepartmentDocumentModule {}
