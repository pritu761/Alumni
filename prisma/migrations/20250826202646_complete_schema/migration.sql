/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Alumni` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Alumni` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'ALUMNI');

-- CreateEnum
CREATE TYPE "public"."RSVPStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED');

-- CreateEnum
CREATE TYPE "public"."MentorshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "public"."Alumni" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'ALUMNI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "capacity" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventRSVP" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "public"."RSVPStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventRSVP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MentorshipRequest" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "menteeId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "public"."MentorshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorshipRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Donation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "purpose" TEXT,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EventRSVP_eventId_userId_key" ON "public"."EventRSVP"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_userId_key" ON "public"."Alumni"("userId");

-- AddForeignKey
ALTER TABLE "public"."Alumni" ADD CONSTRAINT "Alumni_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRSVP" ADD CONSTRAINT "EventRSVP_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRSVP" ADD CONSTRAINT "EventRSVP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MentorshipRequest" ADD CONSTRAINT "MentorshipRequest_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "public"."Alumni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MentorshipRequest" ADD CONSTRAINT "MentorshipRequest_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
