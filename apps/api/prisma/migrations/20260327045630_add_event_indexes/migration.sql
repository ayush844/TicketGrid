-- DropIndex
DROP INDEX "Event_startTime_idx";

-- CreateIndex
CREATE INDEX "Event_isPublished_deletedAt_startTime_idx" ON "Event"("isPublished", "deletedAt", "startTime");
