import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

interface SignupBody {
  userName: string;
  email: string;
  password: string;
  phone: string;
  neighborhoodID: string;
  isProvider?: boolean;
}

export async function POST(req: Request) {
  await connectDB();

  const body: SignupBody = await req.json();
  const { userName, email, password, phone, neighborhoodID, isProvider } = body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    userName,
    email,
    password: hashedPassword,
    phone,
    neighborhoodID,
    isProvider: isProvider || false
  });

  return NextResponse.json({ message: "User created successfully" });
}
