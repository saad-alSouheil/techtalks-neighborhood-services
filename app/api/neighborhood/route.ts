import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Neighborhood from "@/models/Neighborhood";

export async function GET() {
  try {
    await connectDB();
    const neighborhoods = await Neighborhood.find({})
      .select("_id name city")
      .sort({ name: 1 })
      .lean(); 

    // Return array of objects with id, name, and city
    const neighborhoodList = neighborhoods.map((n) => ({ id: n._id, name: n.name, city: n.city }));
    
    return NextResponse.json(neighborhoodList);
  } catch (error) {
    console.error("Error fetching neighborhoods:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}