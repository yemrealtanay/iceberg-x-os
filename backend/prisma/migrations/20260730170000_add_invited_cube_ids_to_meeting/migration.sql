-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN "invited_cube_ids" text[] NOT NULL DEFAULT '{}';
