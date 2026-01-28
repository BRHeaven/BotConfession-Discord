/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Confession_PENDING` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guildId]` on the table `Config` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Confession_PENDING` ADD COLUMN `isSent` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Confession_PENDING_userId_key` ON `Confession_PENDING`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Config_guildId_key` ON `Config`(`guildId`);
