-- Minimum sample size for the rate-based quests that already exist.
--
-- SCOPE: writes ONLY the new "min_sample_size" column, matched by title. A
-- title that does not exist is silently skipped. No other column is read or
-- written, and no CubeQuest / CubeBadge row is touched — nobody had completed
-- any of these quests yet (verified before writing this migration), so there
-- is nothing to revoke.
--
-- Values follow the per-difficulty default the service now falls back to
-- (Common: 3, Rare: 5, Epic: 10), made explicit here so the intent is on
-- record rather than relying on the fallback silently applying.

-- "Reliable Contributor" (Rare, meeting_attendance >= 90): a Cube's first
-- logged meeting used to satisfy this instantly (1/1 = 100%).
UPDATE "Quest" SET "min_sample_size" = 5
WHERE "title" = 'Reliable Contributor' AND "criteria_type" = 'meeting_attendance';

-- "High Achiever" (Rare, average_score >= 4.2): previously required only 2
-- completed missions.
UPDATE "Quest" SET "min_sample_size" = 5
WHERE "title" = 'High Achiever' AND "criteria_type" = 'average_score';

-- "Iceberg Elite Fellow" (Epic, average_score >= 4.7): previously required
-- only 5 completed missions for an Epic-tier reward.
UPDATE "Quest" SET "min_sample_size" = 10
WHERE "title" = 'Iceberg Elite Fellow' AND "criteria_type" = 'average_score';
