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
        const userID = searchParams.get('userID'); // Filter by provider's userID
        const excludeUserID = searchParams.get('excludeUserID'); // Exclude a specific user

        const filter: QueryFilter<IProvider> = {};

        // 0. User ID Filter (get provider for a specific user)
        if (userID) {
            filter.userID = userID;
        } else if (excludeUserID) {
            filter.userID = { $ne: excludeUserID };
        }

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

// POST: Become a provider
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { userID, serviceType, description } = body;

        if (!userID || !serviceType) {
            return NextResponse.json(
                { error: 'Missing required fields: userID or serviceType' },
                { status: 400 }
            );
        }

        // 1. Get user to ensure they exist and find their neighborhood
        const user = await User.findById(userID);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // 2. Check if user is already a provider
        if (user.isProvider) {
            return NextResponse.json(
                { error: 'User is already a provider' },
                { status: 400 }
            );
        }

        // 3. Create the provider record
        const newProvider = await Provider.create({
            userID,
            serviceType,
            description: description || '',
            neighborhoodID: user.neighborhoodID,
            trustScore: 0,
            verification: false, // Default to unverified
        });

        // 4. Update the user record to indicate they are now a provider
        user.isProvider = true;
        await user.save();

        return NextResponse.json(
            { message: 'Successfully registered as a provider!', provider: newProvider },
            { status: 201 }
        );

    } catch (error: unknown) {
        console.error('Error creating provider:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Handle MongoDB duplicate key error (11000) for unique userID
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return NextResponse.json(
                { message: 'Registration failed', error: 'You are already registered as a provider' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Internal server error', error: errorMessage },
            { status: 500 }
        );
    }
}

