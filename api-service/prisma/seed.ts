import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.order.deleteMany();
  await prisma.appUser.deleteMany();
  await prisma.revenuePoint.deleteMany();
  await prisma.dashboardStat.deleteMany();

  await prisma.dashboardStat.createMany({
    data: [
      { title: "Total Revenue", value: 128430, prefix: "$", delta: 12.5, sortOrder: 1 },
      { title: "Orders", value: 3421, delta: 8.2, sortOrder: 2 },
      { title: "Active Users", value: 1893, delta: -2.4, sortOrder: 3 },
      { title: "Conversion Rate", value: 4.7, suffix: "%", delta: 1.1, sortOrder: 4 },
    ],
  });

  await prisma.revenuePoint.createMany({
    data: [
      { month: "Jan", value: 42, sortOrder: 1 },
      { month: "Feb", value: 55, sortOrder: 2 },
      { month: "Mar", value: 48, sortOrder: 3 },
      { month: "Apr", value: 71, sortOrder: 4 },
      { month: "May", value: 63, sortOrder: 5 },
      { month: "Jun", value: 88, sortOrder: 6 },
      { month: "Jul", value: 76, sortOrder: 7 },
      { month: "Aug", value: 95, sortOrder: 8 },
      { month: "Sep", value: 82, sortOrder: 9 },
      { month: "Oct", value: 100, sortOrder: 10 },
      { month: "Nov", value: 91, sortOrder: 11 },
      { month: "Dec", value: 118, sortOrder: 12 },
    ],
  });

  await prisma.appUser.createMany({
    data: [
      { name: "Alice Johnson", email: "alice@acme.io", role: "Admin", status: "active", lastActive: new Date("2026-07-01") },
      { name: "Bob Smith", email: "bob@acme.io", role: "Editor", status: "active", lastActive: new Date("2026-06-29") },
      { name: "Carla Diaz", email: "carla@acme.io", role: "Viewer", status: "invited", lastActive: new Date("2026-06-20") },
      { name: "David Lee", email: "david@acme.io", role: "Editor", status: "suspended", lastActive: new Date("2026-05-11") },
      { name: "Emma Wilson", email: "emma@acme.io", role: "Viewer", status: "active", lastActive: new Date("2026-07-02") },
      { name: "Frank Moore", email: "frank@acme.io", role: "Admin", status: "active", lastActive: new Date("2026-06-30") },
      { name: "Grace Kim", email: "grace@acme.io", role: "Editor", status: "invited", lastActive: new Date("2026-06-18") },
      { name: "Henry Clark", email: "henry@acme.io", role: "Viewer", status: "active", lastActive: new Date("2026-06-28") },
    ],
  });

  await prisma.order.createMany({
    data: [
      { id: "#10231", customer: "Alice Johnson", amount: 249.0, status: "paid", date: new Date("2026-07-02") },
      { id: "#10230", customer: "Bob Smith", amount: 89.5, status: "pending", date: new Date("2026-07-02") },
      { id: "#10229", customer: "Carla Diaz", amount: 1200.0, status: "paid", date: new Date("2026-07-01") },
      { id: "#10228", customer: "David Lee", amount: 42.0, status: "refunded", date: new Date("2026-07-01") },
      { id: "#10227", customer: "Emma Wilson", amount: 560.0, status: "paid", date: new Date("2026-06-30") },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
