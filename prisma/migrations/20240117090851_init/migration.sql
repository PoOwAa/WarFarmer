-- CreateTable
CREATE TABLE "Arcane" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "levelStats" TEXT NOT NULL,
    "drops" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "tradeable" BOOLEAN NOT NULL,
    "urlName" TEXT NOT NULL,
    "collection" TEXT,
    "vosfor" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "ArcanePrices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "arcaneId" INTEGER NOT NULL,
    "sellPrice" TEXT NOT NULL,
    "vosforPerPlat" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArcanePrices_arcaneId_fkey" FOREIGN KEY ("arcaneId") REFERENCES "Arcane" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
