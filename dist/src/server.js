"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const express_1 = __importDefault(require("express"));
BigInt.prototype.toJSON = function () {
    return this.toString();
};
const app = (0, express_1.default)();
const port = 3001;
app.use(require("cors")());
const orders = require("./routes/orders");
const history = require("./routes/history");
const clients = require("./routes/clients");
app.use(express_1.default.json());
app.use("/orders", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), orders);
app.use("/history", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), history);
app.use("/clients", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), clients);
app.use(`/dashboard`, (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), require("./routes/dashboard"));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
//implement error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
