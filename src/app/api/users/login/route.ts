import connectDb from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);
    const userExists = await User.findOne({
      email,
    });
    if (!userExists) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    const validPassword = await bcryptjs.compare(password, userExists.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid password and email" },
        { status: 400 }
      );
    }
    const tokenData = {
      id: userExists._id,
      username: userExists.username,
      email: userExists.email,
    };
    const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const res = NextResponse.json({
      message: "Login successfully",
      success: true,
    });
    res.cookies.set("token", token, {
      httpOnly: true,
    });
    return res;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
