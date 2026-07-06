-- CreateTable
CREATE TABLE "AppUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastActive" DATE NOT NULL,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenuePoint" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "RevenuePoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardStat" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "prefix" TEXT,
    "suffix" TEXT,
    "delta" DOUBLE PRECISION NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "DashboardStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_email_key" ON "AppUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RevenuePoint_month_key" ON "RevenuePoint"("month");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardStat_title_key" ON "DashboardStat"("title");
