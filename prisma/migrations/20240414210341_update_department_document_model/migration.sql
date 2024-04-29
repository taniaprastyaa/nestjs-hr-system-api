/*
  Warnings:

  - A unique constraint covering the columns `[document_name]` on the table `department_documents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[document_file]` on the table `department_documents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `department_documents_document_name_key` ON `department_documents`(`document_name`);

-- CreateIndex
CREATE UNIQUE INDEX `department_documents_document_file_key` ON `department_documents`(`document_file`);
