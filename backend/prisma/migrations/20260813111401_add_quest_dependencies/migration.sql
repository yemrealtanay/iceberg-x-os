-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "dependency_quest_id" TEXT;

-- CreateIndex
CREATE INDEX "Quest_dependency_quest_id_idx" ON "Quest"("dependency_quest_id");

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_dependency_quest_id_fkey" FOREIGN KEY ("dependency_quest_id") REFERENCES "Quest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
