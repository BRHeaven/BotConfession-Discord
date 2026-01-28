/*
  Warnings:

  - You are about to drop the `Confession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Confession`;

-- CreateTable
CREATE TABLE `Confession_PENDING` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `isAnonymous` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Confession_APPROVED` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'APPROVED',
    `isAnonymous` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approvedBy` VARCHAR(191) NOT NULL,
    `approvedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Confession_REJECTED` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'REJECTED',
    `isAnonymous` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `rejectedBy` VARCHAR(191) NOT NULL,
    `rejectedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `forumChannelId` VARCHAR(191) NOT NULL,
    `approvalChannelId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
