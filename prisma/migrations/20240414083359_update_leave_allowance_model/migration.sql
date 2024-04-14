/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `leave_allowances` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `leave_allowances_employee_id_key` ON `leave_allowances`(`employee_id`);
