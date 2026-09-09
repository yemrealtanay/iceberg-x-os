-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('NDA', 'STUDENT_CERTIFICATE', 'TRANSCRIPT', 'INTERNSHIP_CONTRACT', 'SGK_ENTRY', 'ID_COPY', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatar_url" TEXT;

-- Backfill User.avatar_url from existing CubeProfile.avatar_url
UPDATE "User"
SET "avatar_url" = cp."avatar_url"
FROM "CubeProfile" cp
WHERE cp."user_id" = "User"."id"
  AND cp."avatar_url" IS NOT NULL;

-- CreateTable
CREATE TABLE "CubeDocument" (
    "id" TEXT NOT NULL,
    "cube_id" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL DEFAULT 'OTHER',
    "title" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "notes" TEXT,
    "uploaded_by_id" TEXT NOT NULL,
    "reviewed_by_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CubeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CubeDocument_cube_id_idx" ON "CubeDocument"("cube_id");

-- CreateIndex
CREATE INDEX "CubeDocument_type_idx" ON "CubeDocument"("type");

-- CreateIndex
CREATE INDEX "CubeDocument_status_idx" ON "CubeDocument"("status");

-- CreateIndex
CREATE INDEX "CubeDocument_uploaded_by_id_idx" ON "CubeDocument"("uploaded_by_id");

-- AddForeignKey
ALTER TABLE "CubeDocument" ADD CONSTRAINT "CubeDocument_cube_id_fkey" FOREIGN KEY ("cube_id") REFERENCES "CubeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CubeDocument" ADD CONSTRAINT "CubeDocument_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CubeDocument" ADD CONSTRAINT "CubeDocument_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
