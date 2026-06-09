-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MissionStatus" ADD VALUE 'pending_approval';
ALTER TYPE "MissionStatus" ADD VALUE 'completed';

-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'General';

-- AlterTable
ALTER TABLE "MissionTeamMember" ADD COLUMN     "is_submitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "submitted_at" TIMESTAMP(3),
ADD COLUMN     "what_could_be_better" TEXT,
ADD COLUMN     "what_gained" TEXT,
ADD COLUMN     "what_learned" TEXT;
