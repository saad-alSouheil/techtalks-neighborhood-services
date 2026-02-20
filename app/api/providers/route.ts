import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Provider from '@/models/Provider';
import User from '@/models/User';
import Neighborhood from '@/models/Neighborhood';
import type { QueryFilter } from 'mongoose';
import { IProvider, INeighborhood } from '../../../types';


// GET: List providers with filters
export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const city = searchParams.get('city');
        const neighborhood = searchParams.get('neighborhood');
        const service = searchParams.get('service');
        const query = searchParams.get('query'); // Name or description search

        const filter: QueryFilter<IProvider> = {};

        // 1. Service Type Filter
        if (service) {
            filter.serviceType = service;
        }

        // 2. Neighborhood / City Filter
        // Since neighborhood info is in a separate collection, we need to find the Neighborhood IDs first
        if (city || neighborhood) {
            const neighborhoodFilter: QueryFilter<INeighborhood> = {};
            if (city) {
                neighborhoodFilter.city = { $regex: city, $options: 'i' };
            }
            if (neighborhood) {
                neighborhoodFilter.name = { $regex: neighborhood, $options: 'i' };
            }

            const matchedNeighborhoods = await Neighborhood.find(neighborhoodFilter).select('_id');
            const neighborhoodIds = matchedNeighborhoods.map((n) => n._id);

            if (neighborhoodIds.length > 0) {
                filter.neighborhoodID = { $in: neighborhoodIds };
            } else {
                // If filters provided but no neighborhood matched, return empty result immediately
                return NextResponse.json({ providers: [] }, { status: 200 });
            }
        }

        // 3. Search Query (Provider Name or Description)
        if (query) {
            // Find users matching the name
            const matchedUsers = await User.find({
                userName: { $regex: query, $options: 'i' },
            }).select('_id');
            const userIds = matchedUsers.map((u) => u._id);

            // Construct OR query: Match Description OR Match User Name
            filter.$or = [
                { description: { $regex: query, $options: 'i' } },
                { userID: { $in: userIds } },
            ];
        }

        // Only fetch verified providers if required, otherwise fetch all or based on logic
        // filter.verification = true; // Uncomment if we only want verified providers

        const providers = await Provider.find(filter)
            .populate('userID', 'userName email phone isActive')
            .populate('neighborhoodID', 'name city')
            .sort({ trustScore: -1 });

        return NextResponse.json({ providers }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error fetching providers:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { message: 'Internal server error', error: errorMessage },
            { status: 500 }
        );
    }
}

// POST route is temporarily disabled as it requires Auth implementation (verifyToken)
// and strict type checking with the existing User/Provider models.
/*
export async function POST(req: Request) {
    // ... implementation pending auth setup ...
}
*/

