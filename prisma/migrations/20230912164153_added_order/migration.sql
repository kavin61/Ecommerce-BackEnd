-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "intentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "paymentMethodTypes" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "customer" JSONB NOT NULL,
    "shippingDetails" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "total" INTEGER NOT NULL,
    "sts" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
