CREATE TABLE "already_claimed" (
    "id" SERIAL NOT NULL,
    "github_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

CREATE INDEX "already_claimed.github_id_index" ON "already_claimed"("github_id");
