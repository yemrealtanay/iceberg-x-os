-- AlterTable
ALTER TABLE "User" ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "login_streak" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "BadgeRarity" NOT NULL DEFAULT 'Common',
    "criteria_type" TEXT NOT NULL,
    "criteria_value" DOUBLE PRECISION NOT NULL,
    "is_timed" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CubeQuest" (
    "id" TEXT NOT NULL,
    "cube_id" TEXT NOT NULL,
    "quest_id" TEXT NOT NULL,
    "current_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CubeQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuestToBadge" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Quest_difficulty_idx" ON "Quest"("difficulty");

-- CreateIndex
CREATE INDEX "Quest_criteria_type_idx" ON "Quest"("criteria_type");

-- CreateIndex
CREATE INDEX "CubeQuest_cube_id_idx" ON "CubeQuest"("cube_id");

-- CreateIndex
CREATE INDEX "CubeQuest_quest_id_idx" ON "CubeQuest"("quest_id");

-- CreateIndex
CREATE UNIQUE INDEX "CubeQuest_cube_id_quest_id_key" ON "CubeQuest"("cube_id", "quest_id");

-- CreateIndex
CREATE UNIQUE INDEX "_QuestToBadge_AB_unique" ON "_QuestToBadge"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestToBadge_B_index" ON "_QuestToBadge"("B");

-- AddForeignKey
ALTER TABLE "CubeQuest" ADD CONSTRAINT "CubeQuest_cube_id_fkey" FOREIGN KEY ("cube_id") REFERENCES "CubeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CubeQuest" ADD CONSTRAINT "CubeQuest_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestToBadge" ADD CONSTRAINT "_QuestToBadge_A_fkey" FOREIGN KEY ("A") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestToBadge" ADD CONSTRAINT "_QuestToBadge_B_fkey" FOREIGN KEY ("B") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
