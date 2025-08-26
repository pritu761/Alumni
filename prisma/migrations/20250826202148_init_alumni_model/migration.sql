-- CreateTable
CREATE TABLE "public"."Alumni" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "graduationYear" INTEGER NOT NULL,
    "degree" TEXT,
    "department" TEXT,
    "currentJob" TEXT,
    "company" TEXT,
    "location" TEXT,
    "linkedin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alumni_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_email_key" ON "public"."Alumni"("email");
