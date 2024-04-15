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
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma.order.findMany();
    res.json(orders);
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield prisma.order.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    res.json(order);
}));
router.post("/", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quantity, clientId, name, description, agencyDueDate, clientDueDate, } = req.body;
    const order = yield prisma.order.create({
        data: {
            quantity: parseInt(quantity),
            name,
            description,
            agencyDueDate: new Date(agencyDueDate),
            clientDueDate: new Date(clientDueDate),
            status: "Pending",
            client: { connect: { id: parseInt(clientId) } },
            user: { connect: { id: req.auth.userId } },
        }, //this is the data that will be inserted into the database
    });
    res.json(order);
}));
router.put("/:id", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { quantity, clientId, name, description, agencyDueDate, clientDueDate, status, notes, } = req.body;
    (0, tiny_invariant_1.default)(id, "id is required");
    (0, tiny_invariant_1.default)(quantity && typeof quantity === "number", "quantityis required");
    (0, tiny_invariant_1.default)(clientId, "clientId is required");
    (0, tiny_invariant_1.default)(name, "name is required");
    (0, tiny_invariant_1.default)(description, "description is required");
    (0, tiny_invariant_1.default)(agencyDueDate, "agencyDueDate is required");
    (0, tiny_invariant_1.default)(clientDueDate, "clientDueDate is required");
    const order = yield prisma.order.update({
        where: {
            id: parseInt(id),
        },
        data: {
            quantity,
            name,
            description,
            agencyDueDate: new Date(agencyDueDate),
            clientDueDate: new Date(clientDueDate),
            client: { connect: { id: clientId } },
            status,
        },
    });
    yield prisma.orderHistory.create({
        data: {
            order: { connect: { id: parseInt(id) } },
            notes,
            user: { connect: { id: req.auth.userId } },
            status: order.status, // Add the required 'status' property
        },
    });
    res.json(order);
}));
router.delete("/:id", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield prisma.order.delete({
        where: {
            id: parseInt(id),
        },
    });
    res.json(order);
}));
module.exports = router;
