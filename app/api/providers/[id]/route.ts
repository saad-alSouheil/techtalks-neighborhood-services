import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Provider from "@/models/Provider";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const provider = await Provider.findById(id)
      .populate("userID", "userName email phone isActive")
      .populate("neighborhoodID", "name city");

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json(provider, { status: 200 });
  } catch (error) {
    console.error("Error fetching provider:", error);
    return NextResponse.json(
      { error: "Failed to fetch provider" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { description } = body;

    const updatedProvider = await Provider.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );

    if (!updatedProvider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProvider, { status: 200 });
  } catch (error) {
    console.error("Error updating provider:", error);
    return NextResponse.json(
      { error: "Failed to update provider" },
      { status: 500 }
    );
  }
}