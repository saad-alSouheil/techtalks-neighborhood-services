import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import '@/models/Provider'; // register schema for populate
import '@/models/User';     // register schema for populate
import type { QueryFilter } from 'mongoose';
import { IJob } from '../../../types';

// GET: Fetch jobs, optionally filtered by userID or providerID
export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const userID = searchParams.get('userID');
        const providerID = searchParams.get('providerID');
        const status = searchParams.get('status');
        const jobDesc = searchParams.get('jobDesc');

        const filter: QueryFilter<IJob> = {};

        if (userID) {
            filter.userID = userID;
        }

        if (providerID) {
            filter.providerID = providerID;
        }

        if (status) {
            filter.status = status;
        }

        if (jobDesc) {
            filter.jobDesc = { $regex: jobDesc, $options: 'i' } as any;
        }

        const jobs = await Job.find(filter)
            .populate({
                path: 'userID',
                select: 'userName email phone neighborhoodID',
                populate: { path: 'neighborhoodID', select: 'name city' },
            })
            .populate({
                path: 'providerID',
                populate: { path: 'userID', select: 'userName email phone' },
                select: 'serviceType description trustScore verification',
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({ jobs }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error fetching jobs:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { message: 'Internal server error', error: errorMessage },
            { status: 500 }
        );
    }
}

// PATCH: Update job status
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { jobID, status, price } = body;

        if (!jobID || !status) {
            return NextResponse.json(
                { error: 'Missing required fields: jobID, status' },
                { status: 400 }
            );
        }

        const updateData: { status: string; completedDate?: Date; price?: number } = { status };

        // allow price to be set when accepting job
        if (price !== undefined) {
            updateData.price = price;
        }

        if (status === 'completed') {
            updateData.completedDate = new Date();
        }

        const updatedJob = await Job.findByIdAndUpdate(
            jobID,
            updateData,
            { new: true }
        );

        if (!updatedJob) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Job updated successfully', job: updatedJob },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('Error updating job:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST: create a new job request (customer hires provider)
export async function POST(req: Request) {
    try {
        await connectDB();

        const { getCurrentUser } = await import('@/lib/getCurrentUser');
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const body = await req.json();
        const { providerID, jobDesc } = body;
        if (!providerID) {
            return NextResponse.json({ error: 'providerID is required' }, { status: 400 });
        }

        const newJob = await Job.create({
            userID: user._id,
            providerID,
            status: 'pending',
            jobDesc: jobDesc || '',
        });

        return NextResponse.json({ message: 'Job created', job: newJob }, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating job:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
