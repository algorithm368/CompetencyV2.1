-- CreateTable
CREATE TABLE `Users` (
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
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profiles` (
    `email` VARCHAR(255) NOT NULL,
    `tpqi_summary_data_id` INTEGER NULL,
    `sfia_summary_data_id` INTEGER NULL,
    `is_public` BOOLEAN NULL DEFAULT false,

    INDEX `idx_sfia_summary_data`(`sfia_summary_data_id`),
    INDEX `idx_tpqi_summary_data`(`tpqi_summary_data_id`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tokens` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `token` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expired_at` TIMESTAMP(0) NULL,

    INDEX `idx_token_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshTokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRoles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` CHAR(36) NOT NULL,
    `role_id` INTEGER NOT NULL,
    `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_userroles_role`(`role_id`),
    UNIQUE INDEX `uix_user_role`(`user_id`, `role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Permissions_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL,
    `granted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_roleperms_permission`(`permission_id`),
    UNIQUE INDEX `uix_role_permission`(`role_id`, `permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action` VARCHAR(10) NOT NULL,
    `database_name` VARCHAR(100) NOT NULL,
    `table_name` VARCHAR(50) NOT NULL,
    `record_id` INTEGER NULL,
    `uid` VARCHAR(50) NULL,
    `timestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `parameters` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profiles` ADD CONSTRAINT `Profiles_email_fkey` FOREIGN KEY (`email`) REFERENCES `Users`(`email`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Tokens` ADD CONSTRAINT `Tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `RefreshTokens` ADD CONSTRAINT `RefreshTokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRoles` ADD CONSTRAINT `UserRoles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRoles` ADD CONSTRAINT `UserRoles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermissions` ADD CONSTRAINT `RolePermissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermissions` ADD CONSTRAINT `RolePermissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `Permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
