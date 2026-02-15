import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  (await cookies()).delete("token");
  return NextResponse.json({ message: "Logged out successfully" });
}

// allow a GET request (e.g. from a <Link> or form)
export async function GET() {
  (await cookies()).delete("token");
  // redirect back to home (or login)
  return NextResponse.redirect("/");
}
