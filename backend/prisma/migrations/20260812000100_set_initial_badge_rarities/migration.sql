-- Initial rarity for the badges that already exist.
--
-- SCOPE: writes ONLY the "rarity" column, which was created empty (defaulted to
-- 'Common') by the previous migration. Rows are matched by name; a badge that
-- does not exist is silently skipped, and no other column is read or written.
-- Nothing here can lose data: rarity had no meaningful value before this ran.
--
-- The scale:
--   Common — behaviour expected of every Cube in the programme
--   Rare   — a real, demonstrated depth of skill
--   Epic   — moves the programme itself forward; rarely earned

-- Epic: leading, pioneering, lifting others
UPDATE "Badge" SET "rarity" = 'Epic' WHERE "name" IN (
  'Pioneer',          -- opens a new direction for the programme
  'Innovator',        -- original thinking, novel solutions
  'Mission Lead',     -- carried a mission with accountability
  'Future Lead',      -- clear leadership potential
  'Mentor Mindset'    -- made other Cubes better
);

-- Rare: demonstrated depth beyond the baseline
UPDATE "Badge" SET "rarity" = 'Rare' WHERE "name" IN (
  'Builder',
  'Deep Diver',
  'POC Finisher',
  'From Idea to Screen',
  'Prototype Polisher',
  'Clarity Maker',
  'Risk Spotter',
  'Tech Scout',
  'Initiative Taker',
  'Team Organizer',
  'Own Your Work'
);

-- Common: the habits every Cube is expected to show.
-- Set explicitly rather than relying on the column default, so the intent is
-- recorded and re-running this migration is idempotent.
UPDATE "Badge" SET "rarity" = 'Common' WHERE "name" IN (
  'Collaborator',
  'Pathfinder',
  'Researcher',
  'Demo Maker',
  'Show, Don’t Tell',
  'Clear Communicator',
  'Daily Signal',
  'No Ghosting',
  'Early Warner',
  'Feedback Receiver',
  'Self-Aware Cube',
  'No Excuses',
  'Better Next Time',
  'Growth Mindset'
);
