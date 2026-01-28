import { Request, Response } from "express";

export async function sendMessage(req: Request, res: Response) {
  console.log("message sent!");
}
