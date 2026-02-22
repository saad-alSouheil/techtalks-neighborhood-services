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

export async function POST(req: Request) {
    try {
        await connectDB();
        
        const body = await req.json();
        
        if (!body.userID || !body.providerID) {
            return NextResponse.json(
                { message: 'userID and providerID are required' },
                { status: 400 }
            );
        }
        
        const job = await Job.create({
            userID: body.userID,
            providerID: body.providerID,
            price: body.price || null,
            status: body.status || 'pending',
            completedDate: body.completedDate || null,
            createdAt: new Date()
        });
        
        const populatedJob = await Job.findById(job._id)
            .populate('userID', 'userName email phone')
            .populate({
                path: 'providerID',
                populate: { path: 'userID', select: 'userName email phone' },
                select: 'serviceType description trustScore verification',
            });
        
        return NextResponse.json({ job: populatedJob }, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating job:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { message: 'Internal server error', error: errorMessage },
            { status: 500 }
        );
    }
}
