/*
  Warnings:

  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(45)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(45)`.
  - You are about to alter the column `userName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(45)`.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" VARCHAR(45),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(45),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(45),
ALTER COLUMN "userName" SET DATA TYPE VARCHAR(45);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
