import { order } from "@prisma/client";
export type orderWithNotes = order & { notes: string };
