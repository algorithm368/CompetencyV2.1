/*
  Warnings:

  - You are about to drop the `Career` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CareerLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CareerLevelDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CareerLevelKnowledge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CareerLevelSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CareerLevelUnitCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Knowledge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TpqiSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnitCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserKnowledge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserUnitKnowledge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserUnitSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CareerLevel` DROP FOREIGN KEY `CareerLevel_careerId_fkey`;

-- DropForeignKey
ALTER TABLE `CareerLevel` DROP FOREIGN KEY `CareerLevel_levelId_fkey`;

-- DropForeignKey
ALTER TABLE `CareerLevelDetail` DROP FOREIGN KEY `CareerLevelDetail_careerLevelId_fkey`;

-- DropForeignKey
ALTER TABLE `CareerLevelKnowledge` DROP FOREIGN KEY `CareerLevelKnowledge_careerLevelId_fkey`;

-- DropForeignKey
ALTER TABLE `CareerLevelKnowledge` DROP FOREIGN KEY `CareerLevelKnowledge_knowledgeId_fkey`;

-- DropForeignKey
ALTER TABLE `CareerLevelSkill` DROP FOREIGN KEY `CareerLevelSkill_careerLevelId_fkey`;

-- DropForeignKey
ALTER TABLE `CareerLevelSkill` DROP FOREIGN KEY `CareerLevelSkill_skillId_fkey`;

-- DropForeignKey
ALTER TABLE `CareerLevelUnitCode` DROP FOREIGN KEY `CareerLevelUnitCode_careerLevelId_fkey`;

-- DropForeignKey
ALTER TABLE `CareerLevelUnitCode` DROP FOREIGN KEY `CareerLevelUnitCode_unitCodeId_fkey`;

-- DropForeignKey
ALTER TABLE `TpqiSummary` DROP FOREIGN KEY `TpqiSummary_careerId_fkey`;

-- DropForeignKey
ALTER TABLE `TpqiSummary` DROP FOREIGN KEY `TpqiSummary_careerLevelId_fkey`;

-- DropForeignKey
ALTER TABLE `TpqiSummary` DROP FOREIGN KEY `TpqiSummary_levelId_fkey`;

-- DropForeignKey
ALTER TABLE `UserKnowledge` DROP FOREIGN KEY `UserKnowledge_knowledgeId_fkey`;

-- DropForeignKey
ALTER TABLE `UserSkill` DROP FOREIGN KEY `UserSkill_skillId_fkey`;

-- DropForeignKey
ALTER TABLE `UserUnitKnowledge` DROP FOREIGN KEY `UserUnitKnowledge_unitCodeId_fkey`;

-- DropForeignKey
ALTER TABLE `UserUnitSkill` DROP FOREIGN KEY `UserUnitSkill_unitCodeId_fkey`;

-- DropTable
DROP TABLE `Career`;

-- DropTable
DROP TABLE `CareerLevel`;

-- DropTable
DROP TABLE `CareerLevelDetail`;

-- DropTable
DROP TABLE `CareerLevelKnowledge`;

-- DropTable
DROP TABLE `CareerLevelSkill`;

-- DropTable
DROP TABLE `CareerLevelUnitCode`;

-- DropTable
DROP TABLE `Knowledge`;

-- DropTable
DROP TABLE `Level`;

-- DropTable
DROP TABLE `Skill`;

-- DropTable
DROP TABLE `TpqiSummary`;

-- DropTable
DROP TABLE `UnitCode`;

-- DropTable
DROP TABLE `UserKnowledge`;

-- DropTable
DROP TABLE `UserSkill`;

-- DropTable
DROP TABLE `UserUnitKnowledge`;

-- DropTable
DROP TABLE `UserUnitSkill`;

-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `profileImage` VARCHAR(255) NULL DEFAULT 'noimage.jpg',
    `firstNameTH` VARCHAR(255) NULL,
    `lastNameTH` VARCHAR(255) NULL,
    `firstNameEN` VARCHAR(255) NULL,
    `lastNameEN` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `line` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `tpqiSummaryDataId` INTEGER NULL,
    `sfiaSummaryDataId` INTEGER NULL,
    `isPublic` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `Profile_userId_key`(`userId`),
    INDEX `idx_sfia_summary_data`(`sfiaSummaryDataId`),
    INDEX `idx_tpqi_summary_data`(`tpqiSummaryDataId`),
    INDEX `Profile_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `token` TEXT NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expiredAt` TIMESTAMP(0) NULL,

    INDEX `idx_token_user`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` CHAR(36) NOT NULL,
    `roleId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_userroles_role`(`roleId`),
    UNIQUE INDEX `uix_user_role`(`userId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Permission_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,
    `grantedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_roleperms_permission`(`permissionId`),
    UNIQUE INDEX `uix_role_permission`(`roleId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action` VARCHAR(10) NOT NULL,
    `databaseName` VARCHAR(100) NOT NULL,
    `tableName` VARCHAR(50) NOT NULL,
    `recordId` INTEGER NULL,
    `userId` VARCHAR(50) NULL,
    `timestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `parameters` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
