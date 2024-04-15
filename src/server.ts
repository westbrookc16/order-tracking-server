import "dotenv/config";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";
import express, { Express, Request, Response } from "express";
import * as Sentry from "@sentry/node";
//create an express api server that listens on port 3001

const app: Express = express();
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
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err: any, req: any, res: any, next: any) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
