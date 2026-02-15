import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Rating from "@/models/Rating";
import mongoose from "mongoose";
import { updateProviderTrustScore, getProviderStats, validateRatingRequest } from "@/utils/trustScore";

interface RatingBody {
    jobID: string;
    userID: string;
    providerID: string;
    reliability: number;
    punctuality: number;
    priceHonesty: number;
    comment?: string;
}

/**
 * POST /api/rating
 * Create a new rating for a completed job
 */
export async function POST(req: Request) {
    try {
        await connectDB();

        const body: RatingBody = await req.json();
        const { jobID, userID, providerID, reliability, punctuality, priceHonesty, comment } = body;

        // Validate required fields
        if (!jobID || !userID || !providerID || !reliability || !punctuality || !priceHonesty) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(jobID) ||
            !mongoose.Types.ObjectId.isValid(userID) ||
            !mongoose.Types.ObjectId.isValid(providerID)) {
            return NextResponse.json(
                { error: "Invalid ID format" },
                { status: 400 }
            );
        }

        // Validate rating values (1-5)
        if (reliability < 1 || reliability > 5 ||
            punctuality < 1 || punctuality > 5 ||
            priceHonesty < 1 || priceHonesty > 5) {
            return NextResponse.json(
                { error: "Rating values must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Validate the rating request (job eligibility + user/provider authorization)
        const validation = await validateRatingRequest(jobID, userID, providerID);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.error },
                { status: validation.statusCode || 400 }
            );
        }

        // Create the rating
        const newRating = await Rating.create({
            jobID,
            userID,
            providerID,
            reliability,
            punctuality,
            priceHonesty,
            comment: comment || "",
        });

        // Automatically update the provider's trust score
        await updateProviderTrustScore(providerID);

        return NextResponse.json(
            {
                message: "Rating created successfully",
                rating: newRating
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating rating:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/rating
 * Retrieve ratings with optional filters
 * Query params:
 * - providerID: Get all ratings for a specific provider
 * - userID: Get all ratings created by a specific user
 * - jobID: Get rating for a specific job
 */
export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const providerID = searchParams.get("providerID");
        const userID = searchParams.get("userID");
        const jobID = searchParams.get("jobID");

        // Build query filter
        const filter: {
            providerID?: string;
            userID?: string;
            jobID?: string;
        } = {};

        if (providerID) {
            if (!mongoose.Types.ObjectId.isValid(providerID)) {
                return NextResponse.json(
                    { error: "Invalid provider ID format" },
                    { status: 400 }
                );
            }
            filter.providerID = providerID;
        }

        if (userID) {
            if (!mongoose.Types.ObjectId.isValid(userID)) {
                return NextResponse.json(
                    { error: "Invalid user ID format" },
                    { status: 400 }
                );
            }
            filter.userID = userID;
        }

        if (jobID) {
            if (!mongoose.Types.ObjectId.isValid(jobID)) {
                return NextResponse.json(
                    { error: "Invalid job ID format" },
                    { status: 400 }
                );
            }
            filter.jobID = jobID;
        }

        // Fetch ratings with populated references
        const ratings = await Rating.find(filter)
            .populate("userID", "userName email")
            .populate("providerID", "serviceType trustScore verification")
            .populate("jobID", "status price completedDate")
            .sort({ createdAt: -1 }); // Most recent first

        // Get comprehensive statistics if filtering by provider
        let stats = null;
        if (providerID) {
            try {
                stats = await getProviderStats(providerID);
            } catch (error) {
                console.error("Error fetching provider stats:", error);
                // Continue without stats if there's an error
            }
        }

        return NextResponse.json({
            ratings,
            count: ratings.length,
            ...(stats && { stats }),
        });

    } catch (error) {
        console.error("Error fetching ratings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
