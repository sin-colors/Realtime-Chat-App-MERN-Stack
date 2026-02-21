import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken";

export async function signup(req: Request, res: Response) {
  console.log("signup User");
  try {
    const { userName, password, confirmPassword, gender } = req.body;
    // console.log(req.body);
    // console.log("userName: ", userName);
    // console.log("password: ", password);
    // console.log("confirmPassword: ", confirmPassword);
    // console.log("gender: ", gender);
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "パスワードが一致しません" });
    }
    // console.log("パスワードは一致");
    const user = await User.findOne({ userName });
    // console.log("user: ", user);
    if (user) {
      return res
        .status(400)
        .json({ error: `${userName}(ユーザー名)はすでに使われています` });
    }
    // ここでパスワードのハッシュ化を実装
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log("パスワードのハッシュ化終了");

    // https://avatar-placeholder.iran.liara.run/
    // アバターのプレースホルダーを提供するサイト。
    // このサイトから男用と女用のアバターを探してURLをコピーしてきて使う
    // const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    // const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // 上のサイトにアクセスできなかったので、DiceBearというサイトを代わりに使用
    const boyProfilePic = `https://api.dicebear.com/9.x/avataaars/svg?seed=${userName}&top=shortFlat,shortRound,theCaesar,shaggy,shortWaved,shortCurly`;
    const girlProfilePic = `https://api.dicebear.com/9.x/avataaars/svg?seed=${userName}&top=bigHair,bob,curvy,straight01,straightAndStrand`;

    const newUser = new User({
      userName,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    // console.log("newUser: ", newUser);
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
      });
    } else {
      res
        .status(400)
        .json({ error: "新規作成されたユーザーのデータがありません" });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log("Signup controllerでエラーが発生しました", err.message);
    } else {
      console.log("Signup controllerでエラーが発生しました", err);
    }
    res.status(500).json({
      error: "サインアップ実行中にサーバー内部でエラーが発生しました",
    });
  }
}

export async function login(req: Request, res: Response) {
  console.log("login User");
  try {
    const { userName, password } = req.body;
    // console.log("userName: ", userName);
    // console.log("password: ", password);
    const user = await User.findOne({ userName });
    // console.log("user: ", user);
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || "",
    );
    // console.log("isPasswordCorrect: ", isPasswordCorrect);
    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "ユーザー名かパスワードが間違っています" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      profilePic: user.profilePic,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log("Login controllerでエラーが発生しました", err.message);
    } else {
      console.log("Login controllerでエラーが発生しました", err);
    }
    res.status(500).json({
      error: "ログイン実行中にサーバー内部でエラーが発生しました",
    });
  }
}
export function logout(req: Request, res: Response) {
  console.log("logout User");
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "ログアウトしました" });
  } catch (err) {
    if (err instanceof Error) {
      console.log("Logout controllerでエラーが発生しました", err.message);
    } else {
      console.log("Logout controllerでエラーが発生しました", err);
    }
    res
      .status(500)
      .json({ error: "ログアウト実行中にサーバー内部でエラーが発生しました" });
  }
}
