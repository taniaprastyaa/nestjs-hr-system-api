import { applyDecorators, BadRequestException } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

export const UploadDocument = (field: string, destination: string) => 
  applyDecorators(
    UseInterceptors(FileInterceptor(field, {
      storage: diskStorage({
        destination: destination,
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const validExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];

          if (!validExtensions.includes(fileExt.toLowerCase())) {
            cb(new BadRequestException('File must be a PDF, DOC, DOCX, XLS, or XLSX document'), null);
            return;
          }

          const maxSize = 5 * 1024 * 1024;
          if (file.size > maxSize) {
            cb(new BadRequestException('File size must not exceed 5MB'), null);
            return;
          }

          const fileName = `${Date.now()}_${file.originalname}`;
          cb(null, fileName);
        }
      })
    }))
  );
