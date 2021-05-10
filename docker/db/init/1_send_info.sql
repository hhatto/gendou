-- CreateTable
CREATE TABLE "send_info" (
    "id" SERIAL NOT NULL,
    "github_id" TEXT NOT NULL,
    "reward" TEXT NOT NULL,
	"uuid" TEXT NOT NULL,
    "claim_url" TEXT,
    "find_at" TIMESTAMP(3),
    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "send_info.github_id_unique" ON "send_info"("github_id");
CREATE UNIQUE INDEX "send_info.uuid_unique" ON "send_info"("uuid");
