import express, { Request, Response } from "express";
import { Webhook } from "svix";

import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";

const prisma = new PrismaClient();
const router = express.Router();
router.post("/", async (req: Request, res: Response) => {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = req;
  invariant(headerPayload && headerPayload !== undefined, "No headers found.");
  const svix_id = headerPayload.get("svix-id")! as string;
  const svix_timestamp = headerPayload.get("svix-timestamp")! as string;
  const svix_signature = headerPayload.get("svix-signature")! as string;
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new Error("No svix headers found");
    res.send("Error occured -- no svix headers");
  }

  // Get the body
  const payload = await req.body;
  const body = JSON.stringify(payload);
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
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
      await prisma.user.create({
        data: {
          id: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          name: evt.data.first_name + " " + evt.data.last_name,
          isAdmin: true,
          client: { connect: { id: 1 } },
        },
      });
    } else if (evt.type === "user.updated") {
      await prisma.user.update({
        where: {
          id: evt.data.id,
        },
        data: {
          email: evt.data.email_addresses[0].email_address,

          name: evt.data.first_name + " " + evt.data.last_name,
        },
      });
    }
  } catch (err) {
    console.error("Error handling webhook:", err);

    res.send("Error occured");
    return;
  }
  res.send("Webhook received");
  console.log("Webhook received");
});
module.exports = router;
