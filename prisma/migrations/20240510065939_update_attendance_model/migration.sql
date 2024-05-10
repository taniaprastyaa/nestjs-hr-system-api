/*
  Warnings:

  - Added the required column `delay_minutes` to the `attendances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendances` ADD COLUMN `delay_minutes` INTEGER NOT NULL;
