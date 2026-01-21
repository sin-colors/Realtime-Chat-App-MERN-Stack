import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Response } from "express";

function generateTokenAndSetCookie(userId: Types.ObjectId, res: Response) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("環境変数にJWT_SECRETが設定されていません");
  const token = jwt.sign({ userId }, secret, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
}
export default generateTokenAndSetCookie;
