/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DataCollection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Description` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Information` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SfiaSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_subcategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Description` DROP FOREIGN KEY `Description_levelId_fkey`;

-- DropForeignKey
ALTER TABLE `Information` DROP FOREIGN KEY `Information_dataCollectionId_fkey`;

-- DropForeignKey
ALTER TABLE `Information` DROP FOREIGN KEY `Information_subSkillId_fkey`;

-- DropForeignKey
ALTER TABLE `Level` DROP FOREIGN KEY `Level_skillCode_fkey`;

-- DropForeignKey
ALTER TABLE `SfiaSummary` DROP FOREIGN KEY `SfiaSummary_levelId_fkey`;

-- DropForeignKey
ALTER TABLE `SfiaSummary` DROP FOREIGN KEY `SfiaSummary_skillCode_fkey`;

-- DropForeignKey
ALTER TABLE `Skill` DROP FOREIGN KEY `Skill_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `SubSkill` DROP FOREIGN KEY `SubSkill_descriptionId_fkey`;

-- DropForeignKey
ALTER TABLE `SubSkill` DROP FOREIGN KEY `SubSkill_skillCode_fkey`;

-- DropTable
DROP TABLE `Category`;

-- DropTable
DROP TABLE `DataCollection`;

-- DropTable
DROP TABLE `Description`;

-- DropTable
DROP TABLE `Information`;

-- DropTable
DROP TABLE `Level`;

-- DropTable
DROP TABLE `SfiaSummary`;

-- DropTable
DROP TABLE `Skill`;

-- DropTable
DROP TABLE `SubSkill`;

-- DropTable
DROP TABLE `Subcategory`;

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
    INDEX `User_email_idx`(`email`),
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
CREATE TABLE `Session` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `accessToken` TEXT NOT NULL,
    `refreshToken` TEXT NOT NULL,
    `csrfToken` VARCHAR(255) NOT NULL,
    `provider` VARCHAR(20) NOT NULL DEFAULT 'local',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,
    `expiresAt` TIMESTAMP(0) NOT NULL,
    `lastActivityAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `parentRoleId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    INDEX `Role_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` CHAR(36) NOT NULL,
    `roleId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_userroles_role`(`roleId`),
    INDEX `idx_userroles_user`(`userId`),
    UNIQUE INDEX `uix_user_role`(`userId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Operation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Operation_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tableName` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Asset_tableName_key`(`tableName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssetInstance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assetId` INTEGER NOT NULL,
    `recordId` VARCHAR(100) NOT NULL,

    INDEX `AssetInstance_assetId_idx`(`assetId`),
    INDEX `AssetInstance_recordId_idx`(`recordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAssetInstance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` CHAR(36) NOT NULL,
    `assetInstanceId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserAssetInstance_userId_idx`(`userId`),
    INDEX `UserAssetInstance_assetInstanceId_idx`(`assetInstanceId`),
    UNIQUE INDEX `uix_user_asset_instance`(`userId`, `assetInstanceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `operationId` INTEGER NOT NULL,
    `assetId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Permission_operationId_idx`(`operationId`),
    INDEX `Permission_assetId_idx`(`assetId`),
    UNIQUE INDEX `uix_operation_asset`(`operationId`, `assetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,
    `grantedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_roleperms_permission`(`permissionId`),
    INDEX `idx_roleperms_role`(`roleId`),
    UNIQUE INDEX `uix_role_permission`(`roleId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT') NOT NULL,
    `databaseName` VARCHAR(100) NOT NULL,
    `tableName` VARCHAR(50) NOT NULL,
    `recordId` VARCHAR(100) NULL,
    `userId` VARCHAR(50) NULL,
    `timestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `parameters` TEXT NULL,

    INDEX `Log_userId_idx`(`userId`),
    INDEX `Log_action_idx`(`action`),
    INDEX `Log_tableName_idx`(`tableName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_parentRoleId_fkey` FOREIGN KEY (`parentRoleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetInstance` ADD CONSTRAINT `AssetInstance_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAssetInstance` ADD CONSTRAINT `UserAssetInstance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAssetInstance` ADD CONSTRAINT `UserAssetInstance_assetInstanceId_fkey` FOREIGN KEY (`assetInstanceId`) REFERENCES `AssetInstance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_operationId_fkey` FOREIGN KEY (`operationId`) REFERENCES `Operation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
