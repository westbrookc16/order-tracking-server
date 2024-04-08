import { json } from "../types/json";
import { Prisma } from "@prisma/client";
import { order } from "@prisma/client";
import express, { Request, Response } from "express";
import { dashboard } from "../types/dashboard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();
router.get("/", async (req: Request, res: Response) => {
  const fieldName = "agencyDueDate";

  const { userId } = req.auth;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  let sql: string = `select c.name, c.id, sum(case when "${fieldName}"-CURRENT_DATE>=21 then 1 else 0 end) as perif, sum(case when "${fieldName}"-CURRENT_DATE>=14 and "${fieldName}"-CURRENT_DATE<21 then 1 else 0 end)as "onTarget", sum(case when "${fieldName}"-CURRENT_DATE>=7 and "${fieldName}"-CURRENT_DATE<14 then 1 else 0 end)as concern, sum(case when "${fieldName}"-CURRENT_DATE>=3 and "${fieldName}"-CURRENT_DATE<7 then 1 else 0 end)as critical, sum(case when "${fieldName}"-CURRENT_DATE<3 then 1 else 0 end) as "error" from "order" o inner join "client" c on o."clientId"=c.id `;
  if (!user?.isAdmin) {
    sql += ` where c."id"=${user?.clientId} `;
  }
  sql += ` group by c.name, c.id`;
  const totals = await prisma.$queryRawUnsafe<dashboard[]>(sql);
  res.send(json(totals));
});
router.get("/:id/:status", async (req: Request, res: Response) => {
  const { id, status } = req.params;
  console.log(`id:${id}, status:${status}`);
  const fieldName = "agencyDueDate";
  let sql = `select o.* from "order" o where o."clientId"=${id}`;
  if (status === "perif") {
    sql += ` and "${fieldName}"-CURRENT_DATE>=21`;
  }
  if (status === "onTarget") {
    sql += ` and "${fieldName}"-CURRENT_DATE>=14 and "${fieldName}"-CURRENT_DATE<21`;
  }
  if (status === "concern") {
    sql += ` and "${fieldName}"-CURRENT_DATE>=7 and "${fieldName}"-CURRENT_DATE<14`;
  }
  if (status === "critical") {
    sql += ` and "${fieldName}"-CURRENT_DATE>=3 and "${fieldName}"-CURRENT_DATE<7`;
  }

  if (status === "error") {
    sql += ` and "${fieldName}"-CURRENT_DATE<3`;
  }
  const orders = await prisma.$queryRawUnsafe<order[]>(sql);
  res.json(orders);
  console.log(orders.length);
});
module.exports = router;
