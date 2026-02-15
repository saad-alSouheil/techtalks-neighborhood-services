import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function getCurrentUser() {
  const allCookies = (await cookies()).getAll();
  console.log("ALL COOKIES:", allCookies);

  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    await connectDB();

    const user = await User.findById(decoded.id)
      .select("-password")
      .lean();

    return user;
  } catch {
    return null;
  }
}
