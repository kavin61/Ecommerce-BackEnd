-- CreateTable
CREATE TABLE "UpdateCart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "stock" BOOLEAN NOT NULL,
    "actualPrice" INTEGER NOT NULL,
    "discountedPercent" INTEGER NOT NULL,
    "TotalPages" INTEGER NOT NULL,

    CONSTRAINT "UpdateCart_pkey" PRIMARY KEY ("id")
);
