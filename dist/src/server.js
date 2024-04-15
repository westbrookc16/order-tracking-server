"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const express_1 = __importDefault(require("express"));
const Sentry = __importStar(require("@sentry/node"));
//create an express api server that listens on port 3001
const app = (0, express_1.default)();
const port = 3001;
Sentry.init({
    dsn: "https://b1dccb5a0c3ca6b372d55729742fe431@o4506937756876800.ingest.us.sentry.io/4507087830646784",
});
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
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
app.use(Sentry.Handlers.errorHandler());
// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
