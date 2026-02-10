import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Neighborhood from "@/models/Neighborhood";

export async function GET() {
  try {
    await connectDB();
    const neighborhoods = await Neighborhood.find({})
      .select("name")
      .sort({ name: 1 })
      .lean(); 

    const neighborhoodNames = neighborhoods.map((n) => n.name);
    
    return NextResponse.json(neighborhoodNames);
  } catch (error) {
    console.error("Error fetching neighborhoods:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}