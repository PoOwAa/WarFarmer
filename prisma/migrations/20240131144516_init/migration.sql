-- CreateTable
CREATE TABLE "Arcane" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "levelStats" JSONB NOT NULL,
    "drops" JSONB NOT NULL,
    "rarity" TEXT NOT NULL,
    "tradeable" BOOLEAN NOT NULL,
    "urlName" TEXT NOT NULL,
    "collection" TEXT,
    "vosfor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Arcane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArcanePrices" (
    "id" SERIAL NOT NULL,
    "arcaneId" INTEGER NOT NULL,
    "sellPrice" TEXT NOT NULL,
    "vosforPerPlat" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArcanePrices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArcanePrices" ADD CONSTRAINT "ArcanePrices_arcaneId_fkey" FOREIGN KEY ("arcaneId") REFERENCES "Arcane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
