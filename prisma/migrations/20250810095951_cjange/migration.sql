/*
  Warnings:

  - You are about to drop the column `auth0Id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `managerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `GeoFence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."GeoFence" DROP CONSTRAINT "GeoFence_managerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Shift" DROP CONSTRAINT "Shift_userId_fkey";

-- DropIndex
DROP INDEX "public"."User_auth0Id_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "auth0Id",
DROP COLUMN "managerId",
DROP COLUMN "name",
DROP COLUMN "role";

-- DropTable
DROP TABLE "public"."GeoFence";

-- DropTable
DROP TABLE "public"."Shift";
