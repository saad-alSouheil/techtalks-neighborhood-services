import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET() {
  const token = cookies().get("token")?.value;
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.id]
    );

    return Response.json(rows[0]);
  } catch {
    return new Response("Invalid token", { status: 401 });
  }
}
