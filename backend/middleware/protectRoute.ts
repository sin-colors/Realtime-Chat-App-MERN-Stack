import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User, { UserType } from "../models/user.model";

interface DecodedToken extends JwtPayload {
  userId: string;
}

// src/types/express.d.tsというファイルを作成し、そこに共通の型拡張をまとめるのが一般的
// 今回は小規模なアプリのため特に問題ないので、このままここに記述しておく
declare global {
  namespace Express {
    interface Request {
      user?: UserType | null;
    }
  }
}

async function protectRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ error: "未承認 : トークンが提供されていません" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (!decoded) {
      return res.status(401).json({ error: "未承認 : トークンが無効です" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりませんでした" });
    }
    req.user = user as UserType;
    next();
  } catch (err) {
    if (err instanceof Error) {
      console.log("protectRoute middlewareでエラーが発生しました", err.message);
    } else {
      console.log("protectRoute middlewareでエラーが発生しました", err);
    }
  }
}

export default protectRoute;
