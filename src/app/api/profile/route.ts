import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userModel";
import connectDb from "@/dbConfig/dbConfig";

connectDb();

export async function GET(request: NextRequest) {
  try {
    const decodedData = getDataFromToken(request);
    if (decodedData instanceof NextResponse) {
      return decodedData;
    }
    const user = await User.findById(decodedData.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "User found", user });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
