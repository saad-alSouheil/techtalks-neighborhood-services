import mongoose, { Schema, Model } from 'mongoose';
import { IRating } from '../types';

const ratingSchema = new Schema<IRating>(
  {
    jobID: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
      unique: true, // One rating per job - prevents fake reviews
    },
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
    reliability: {
      type: Number,
      required: [true, 'Reliability rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not exceed 5'],
    },
    punctuality: {
      type: Number,
      required: [true, 'Punctuality rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not exceed 5'],
    },
    priceHonesty: {
      type: Number,
      required: [true, 'Price honesty rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment must not exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ratingSchema.index({ providerID: 1, createdAt: -1 });
ratingSchema.index({ userID: 1, createdAt: -1 });

const Rating: Model<IRating> =
  mongoose.models.Rating || mongoose.model<IRating>('Rating', ratingSchema);

export default Rating;
