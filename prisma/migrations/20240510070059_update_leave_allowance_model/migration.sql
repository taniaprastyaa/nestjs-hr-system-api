/*
  Warnings:

  - You are about to alter the column `leave_allowances` on the `leave_allowances` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `leave_allowances` MODIFY `leave_allowances` DOUBLE NOT NULL DEFAULT 12;
