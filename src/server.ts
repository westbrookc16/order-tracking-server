import "dotenv/config";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";
import express, { Express, Request, Response } from "express";
//create an express api server that listens on port 3001

const app: Express = express();
const port = 3001;
app.use(require("cors")());
const orders = require("./routes/orders");
const history = require("./routes/history");
const clients = require("./routes/clients");
declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}
app.use(express.json());
app.use("/orders", ClerkExpressRequireAuth(), orders);
app.use("/history", ClerkExpressRequireAuth(), history);
app.use("/clients", ClerkExpressRequireAuth(), clients);
app.use(`/dashboard`, ClerkExpressRequireAuth(), require("./routes/dashboard"));
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
//implement error handling
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
