import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define the structure of the decoded token
interface DecodedToken {
  id: string;
  email: string;
  iat?: number; // Issued at time (optional)
  exp?: number; // Expiry time (optional)
}

export function getDataFromToken(request: NextRequest) {
  try {
    // Retrieve the token from cookies
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify and decode the token
    const decodedData = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as DecodedToken;

    return decodedData;
  } catch (error) {
    // Handle errors properly
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
