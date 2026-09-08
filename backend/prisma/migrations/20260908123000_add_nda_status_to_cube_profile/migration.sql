-- AlterTable
ALTER TABLE "CubeProfile" ADD COLUMN "nda_status" TEXT NOT NULL DEFAULT 'not_sent';

-- Sync any already-signed cubes
UPDATE "CubeProfile" SET "nda_status" = 'signed' WHERE "nda_signed" = true;

-- CreateIndex
CREATE INDEX "CubeProfile_nda_status_idx" ON "CubeProfile"("nda_status");
