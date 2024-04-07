import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get(`/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderHistory = await prisma.orderHistory.findMany({
    include: {
      user: true,
    },
    where: {
      orderId: parseInt(id),
    },
  });
  res.json(orderHistory);
});
module.exports = router;
