import connectDb from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendMail } from "@/helpers/mailer";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, username, password } = reqBody;
    console.log(reqBody);
    const userExists = await User.findOne({
      email,
    });
    if (userExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });
    const saveUser = await newUser.save();
    console.log(saveUser);

    //send email verification
    await sendMail({
      email,
      emailType: "verify",
      userId: saveUser._id.toString(),
    });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      saveUser,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
