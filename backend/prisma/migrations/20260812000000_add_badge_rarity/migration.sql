-- Badge rarity (Common / Rare / Epic) and an optional accent colour.
--
-- ADDITIVE ONLY: a new enum type, two new columns on "Badge", and an index.
-- No existing column is altered and no existing row is rewritten — every badge
-- that already exists simply picks up the default rarity 'Common'. The actual
-- rarity assignment is a separate, reviewable data migration.

-- CreateEnum
CREATE TYPE "BadgeRarity" AS ENUM ('Common', 'Rare', 'Epic');

-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "accent" TEXT,
ADD COLUMN     "rarity" "BadgeRarity" NOT NULL DEFAULT 'Common';

-- CreateIndex
CREATE INDEX "Badge_rarity_idx" ON "Badge"("rarity");

