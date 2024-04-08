"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const luxon_1 = require("luxon");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.client.upsert({
            where: { name: "Chris's programming shop" },
            update: {},
            create: {
                name: "Chris's programming shop",
                description: "A shop for all your programming needs",
            },
        });
        yield prisma.user.upsert({
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
        yield prisma.client.upsert({
            where: { name: "Abu's Great Shop" },
            update: {},
            create: {
                name: "Abu's Great Shop",
                description: "A shop for all your needs",
            },
        });
        yield prisma.client.upsert({
            where: { name: "Accessible Sites Inc." },
            update: {},
            create: {
                name: "Accessible Sites Inc.",
                description: "A shop for all your accessibility needs",
            },
        });
        yield prisma.client.upsert({
            where: { name: "Chris's Dog Care" },
            update: {},
            create: {
                name: "Chris's Dog Care",
                description: "A shop for all your veternary needs",
            },
        });
        yield prisma.client.upsert({
            where: { name: "Chris's Freelance Paradise" },
            update: {},
            create: {
                name: "Chris's Freelance Paradise",
                description: "A shop for all your freelance needs",
            },
        });
        //now we insert orders
        for (let i = 0; i < 200; i++) {
            yield prisma.order.upsert({
                where: { id: i },
                update: {},
                create: {
                    quantity: 1,
                    clientId: (i % 5) + 1,
                    agencyDueDate: luxon_1.DateTime.now()
                        .startOf("day")
                        .plus({ days: i % 31 })
                        .toJSDate(),
                    clientDueDate: luxon_1.DateTime.now()
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
    });
}
try {
    main();
}
catch (e) {
    console.error(e);
}
