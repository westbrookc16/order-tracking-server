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
const svix_1 = require("svix");
const client_1 = require("@prisma/client");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }
    // Get the headers
    const headerPayload = req;
    (0, tiny_invariant_1.default)(headerPayload && headerPayload !== undefined, "No headers found.");
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");
    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        throw new Error("No svix headers found");
        res.send("Error occured -- no svix headers");
    }
    // Get the body
    const payload = yield req.body;
    const body = JSON.stringify(payload);
    // Create a new Svix instance with your secret.
    const wh = new svix_1.Webhook(WEBHOOK_SECRET);
    let evt;
    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    }
    catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }
    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;
    //
    try {
        if (evt.type === "user.created") {
            yield prisma.user.create({
                data: {
                    id: evt.data.id,
                    email: evt.data.email_addresses[0].email_address,
                    name: evt.data.first_name + " " + evt.data.last_name,
                    isAdmin: true,
                    client: { connect: { id: 1 } },
                },
            });
        }
        else if (evt.type === "user.updated") {
            yield prisma.user.update({
                where: {
                    id: evt.data.id,
                },
                data: {
                    email: evt.data.email_addresses[0].email_address,
                    name: evt.data.first_name + " " + evt.data.last_name,
                },
            });
        }
    }
    catch (err) {
        console.error("Error handling webhook:", err);
        res.send("Error occured");
        return;
    }
    res.send("Webhook received");
    console.log("Webhook received");
}));
module.exports = router;
