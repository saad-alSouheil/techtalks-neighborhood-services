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

        const jobs = await Job.find(filter)
            .populate('userID', 'userName email phone')
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
        const { jobID, status } = body;

        if (!jobID || !status) {
            return NextResponse.json(
                { error: 'Missing required fields: jobID, status' },
                { status: 400 }
            );
        }

        const updateData: { status: string; completedDate?: Date } = { status };

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
