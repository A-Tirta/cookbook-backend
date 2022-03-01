/*
  Warnings:

  - You are about to drop the column `create_date` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `update_date` on the `user` table. All the data in the column will be lost.
  - Added the required column `update_at` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `create_date`,
    DROP COLUMN `update_date`,
    ADD COLUMN `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `update_at` DATETIME(0) NOT NULL;

-- CreateTable
CREATE TABLE `recepies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` DATETIME(0) NOT NULL,
    `userId` INTEGER NOT NULL,
    `ingredients` TEXT NOT NULL,
    `directions` TEXT NOT NULL,
    `author_comments` TEXT NULL,
    `posted` BOOLEAN NOT NULL,
    `likes` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` DATETIME(0) NOT NULL,
    `comments` TEXT NOT NULL,
    `userId` INTEGER NOT NULL,
    `recepiesId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recepies` ADD CONSTRAINT `recepies_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_recepiesId_fkey` FOREIGN KEY (`recepiesId`) REFERENCES `recepies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
