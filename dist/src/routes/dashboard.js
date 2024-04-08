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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const superjson_1 = __importDefault(require("superjson"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fieldName = "agencyDueDate";
    const { userId } = req.auth;
    const user = yield prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    let sql = `select c.name, c.id, sum(case when "${fieldName}"-CURRENT_DATE>=21 then 1 else 0 end) as perif, sum(case when "${fieldName}"-CURRENT_DATE>=14 and "${fieldName}"-CURRENT_DATE<21 then 1 else 0 end)as "onTarget", sum(case when "${fieldName}"-CURRENT_DATE>=7 and "${fieldName}"-CURRENT_DATE<14 then 1 else 0 end)as concern, sum(case when "${fieldName}"-CURRENT_DATE>=3 and "${fieldName}"-CURRENT_DATE<7 then 1 else 0 end)as critical, sum(case when "${fieldName}"-CURRENT_DATE<3 then 1 else 0 end) as "error" from "order" o inner join "client" c on o."clientId"=c.id `;
    if (!(user === null || user === void 0 ? void 0 : user.isAdmin)) {
        sql += ` where c."id"=${user === null || user === void 0 ? void 0 : user.clientId} `;
    }
    sql += ` group by c.name, c.id`;
    const totals = yield prisma.$queryRawUnsafe(sql);
    res.send(superjson_1.default.stringify(totals));
}));
router.get("/:id/:status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, status } = req.params;
    console.log(`id:${id}, status:${status}`);
    const fieldName = "agencyDueDate";
    let sql = `select o.* from "order" o where o."clientId"=${id}`;
    if (status === "perif") {
        sql += ` and "${fieldName}"-CURRENT_DATE>=21`;
    }
    if (status === "onTarget") {
        sql += ` and "${fieldName}"-CURRENT_DATE>=14 and "${fieldName}"-CURRENT_DATE<21`;
    }
    if (status === "concern") {
        sql += ` and "${fieldName}"-CURRENT_DATE>=7 and "${fieldName}"-CURRENT_DATE<14`;
    }
    if (status === "critical") {
        sql += ` and "${fieldName}"-CURRENT_DATE>=3 and "${fieldName}"-CURRENT_DATE<7`;
    }
    if (status === "error") {
        sql += ` and "${fieldName}"-CURRENT_DATE<3`;
    }
    const orders = yield prisma.$queryRawUnsafe(sql);
    res.json(orders);
    console.log(orders.length);
}));
module.exports = router;
