-- Minimum sample size for rate-based quest criteria (average_score, meeting_attendance).
--
-- ADDITIVE ONLY: one nullable column. No existing row is read or rewritten —
-- every Quest that already exists keeps min_sample_size = NULL, which the
-- service layer treats as "use the per-difficulty default" so behaviour for
-- untouched quests does not change until an admin (or the follow-up data
-- migration) sets an explicit value.

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "min_sample_size" INTEGER;
