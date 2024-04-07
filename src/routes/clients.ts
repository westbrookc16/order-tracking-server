//create an express router for clients
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();
router.get("/", async (req: Request, res: Response) => {
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" } });
  res.json(clients);
});
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = await prisma.client.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(client);
});

router.post("/", async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const client = await prisma.client.create({
    data: {
      name,
      description,
    },
  });
  res.json(client);
});

router.put("/:id", async (req: Request, res: Response) => {
  console.log(`updating server.`);
  const { id } = req.params;
  console.log(`id:${id}`);

  const { name, description, isActive } = req.body;
  const client = await prisma.client.update({
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
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = await prisma.client.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.json(client);
});
module.exports = router;
