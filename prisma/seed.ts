import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
const prisma = new PrismaClient();
async function main() {
  await prisma.client.upsert({
    where: { name: "Chris's programming shop" },
    update: {},
    create: {
      name: "Chris's programming shop",
      description: "A shop for all your programming needs",
    },
  });
  await prisma.user.upsert({
    where: { id: "user_2ecA6qT9eW6tEFEBz3qG6Mvhdto" },
    update: {},
    create: {
      id: "user_2ecA6qT9eW6tEFEBz3qG6Mvhdto",
      email: "westbchris@gmail.com",
      name: "Chris Westbrook",
      clientId: 1,
      isAdmin: true,
    },
  });
  await prisma.client.upsert({
    where: { name: "Abu's Great Shop" },
    update: {},
    create: {
      name: "Abu's Great Shop",
      description: "A shop for all your needs",
    },
  });
  await prisma.client.upsert({
    where: { name: "Accessible Sites Inc." },
    update: {},
    create: {
      name: "Accessible Sites Inc.",
      description: "A shop for all your accessibility needs",
    },
  });
  await prisma.client.upsert({
    where: { name: "Chris's Dog Care" },
    update: {},
    create: {
      name: "Chris's Dog Care",
      description: "A shop for all your veternary needs",
    },
  });
  await prisma.client.upsert({
    where: { name: "Chris's Freelance Paradise" },
    update: {},
    create: {
      name: "Chris's Freelance Paradise",
      description: "A shop for all your freelance needs",
    },
  });
  //now we insert orders
  for (let i = 0; i < 200; i++) {
    await prisma.order.upsert({
      where: { id: i },
      update: {},
      create: {
        quantity: 1,
        clientId: (i % 5) + 1,
        agencyDueDate: DateTime.now()
          .startOf("day")
          .plus({ days: i % 31 })

          .toJSDate(),

        clientDueDate: DateTime.now()
          .startOf("day")
          .plus({ days: i % 31 })

          .toJSDate(),
        status: "Pending",
        description: "A description of the order",
        name: "Order " + i,
        userId: "user_2ecA6qT9eW6tEFEBz3qG6Mvhdto",
      },
    });
  }
}
try {
  main();
} catch (e) {
  console.error(e);
}
