import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function getDataFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decodedData: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    );
    return decodedData;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
