import mongoose, { Schema, Model } from 'mongoose';
import { IJob, JobStatus } from '../types';

const jobSchema = new Schema<IJob>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    providerID: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: [true, 'Provider ID is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'completed', 'cancelled'] as JobStatus[],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
    },
    completedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
jobSchema.index({ userID: 1, createdAt: -1 });
jobSchema.index({ providerID: 1, createdAt: -1 });
jobSchema.index({ status: 1 });
jobSchema.index({ completedDate: -1 });

// Compound index to track user-provider relationships
jobSchema.index({ userID: 1, providerID: 1 });

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);

export default Job;