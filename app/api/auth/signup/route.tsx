import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req) {
  const { name, email, password, role } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role]
  );

  return Response.json({ message: "User created" });
}
