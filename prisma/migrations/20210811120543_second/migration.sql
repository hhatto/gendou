-- CreateTable
CREATE TABLE "airdrop" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "reward" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "airdrop.address_unique" ON "airdrop"("address");
