/*
  Warnings:

  - Added the required column `year` to the `leave_allowances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `leave_allowances` ADD COLUMN `year` VARCHAR(191) NOT NULL;
