/*
  Warnings:

  - A unique constraint covering the columns `[department_name,deletedAt]` on the table `departments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `departments_department_name_key` ON `departments`;

-- CreateIndex
CREATE UNIQUE INDEX `departments_department_name_deletedAt_key` ON `departments`(`department_name`, `deletedAt`);
