CREATE TABLE "reward" (
    "id" SERIAL NOT NULL,
    "commit_lower_limit" INTEGER NOT NULL,
    "commit_upper_limit" INTEGER NOT NULL,
    "reward" TEXT NOT NULL,
	"rank" INTEGER NOT NULL,
    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "reward.commit_lower_limit_unique" ON "reward"("commit_lower_limit");
CREATE UNIQUE INDEX "reward.commit_upper_limit_unique" ON "reward"("commit_upper_limit");
CREATE UNIQUE INDEX "reward.rank_unique" ON "reward"("rank");

DMAIL
MDIAL
AMILD
LMaid

