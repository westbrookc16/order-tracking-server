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
//create an express router for clients
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clients = yield prisma.client.findMany({ orderBy: { name: "asc" } });
    res.json(clients);
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const client = yield prisma.client.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    res.json(client);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const client = yield prisma.client.create({
        data: {
            name,
            description,
        },
    });
    res.json(client);
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`updating server.`);
    const { id } = req.params;
    console.log(`id:${id}`);
    const { name, description, isActive } = req.body;
    const client = yield prisma.client.update({
        where: {
            id: parseInt(id),
        },
        data: {
            name,
            description,
            isActive,
        },
    });
    res.json(client);
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const client = yield prisma.client.delete({
        where: {
            id: parseInt(id),
        },
    });
    res.json(client);
}));
module.exports = router;
