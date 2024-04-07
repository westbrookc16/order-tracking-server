import express, { Request, Response } from "express";
import invariant from "tiny-invariant";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();
router.get("/", async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany();
  res.json(orders);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(order);
});

router.post(
  "/",
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    const {
      quantity,
      clientId,
      name,
      description,
      agencyDueDate,
      clientDueDate,
    } = req.body;
    const order = await prisma.order.create({
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
  }
);
router.put(
  "/:id",
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
      quantity,
      clientId,
      name,
      description,
      agencyDueDate,
      clientDueDate,
      status,
      notes,
    } = req.body;
    invariant(id, "id is required");
    invariant(quantity && typeof quantity === "number", "quantityis required");
    invariant(clientId, "clientId is required");

    invariant(name, "name is required");
    invariant(description, "description is required");
    invariant(agencyDueDate, "agencyDueDate is required");
    invariant(clientDueDate, "clientDueDate is required");

    const order = await prisma.order.update({
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
    await prisma.orderHistory.create({
      data: {
        order: { connect: { id: parseInt(id) } },
        notes,
        user: { connect: { id: req.auth.userId } },
        status: order.status, // Add the required 'status' property
      },
    });
    res.json(order);
  }
);
router.delete(
  "/:id",
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await prisma.order.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json(order);
  }
);
module.exports = router;
