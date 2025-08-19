/*
  Warnings:

  - Added the required column `csrfToken` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Made the column `expiresAt` on table `Session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Session` ADD COLUMN `csrfToken` VARCHAR(255) NOT NULL,
    ADD COLUMN `lastActivityAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `provider` VARCHAR(20) NOT NULL DEFAULT 'local',
    MODIFY `expiresAt` TIMESTAMP(0) NOT NULL;
