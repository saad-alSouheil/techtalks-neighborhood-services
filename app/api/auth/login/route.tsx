import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  await connectDB();

  const body: LoginBody = await req.json();
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user._id, isProvider: user.isProvider },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  (await cookies()).set("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7
  });

  return NextResponse.json({
    id: user._id,
    userName: user.userName,
    isProvider: user.isProvider
  });
}
