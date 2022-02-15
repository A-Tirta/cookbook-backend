-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL,
    `create_date` DATETIME(0) NOT NULL,
    `update_date` DATETIME(0) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` TEXT NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
