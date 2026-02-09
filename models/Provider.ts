import mongoose, { Schema, Model } from 'mongoose';
import { IProvider, ServiceType } from '../types';

const providerSchema = new Schema<IProvider>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true, // Each provider is linked to exactly one user
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: {
        values: [
          'plumbing',
          'electrical',
          'carpentry',
          'painting',
          'cleaning',
          'gardening',
          'hvac',
          'roofing',
          'handyman',
          'moving',
          'appliance-repair',
          'pest-control',
          'other',
        ] as ServiceType[],
        message: '{VALUE} is not a valid service type',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must not exceed 1000 characters'],
    },
    trustScore: {
      type: Number,
      default: 0,
      min: [0, 'Trust score cannot be negative'],
      max: [5, 'Trust score cannot exceed 5'],
    },
    verification: {
      type: Boolean,
      default: false, // Not verified by default
    },
    neighborhoodID: {
      type: Schema.Types.ObjectId,
      ref: 'Neighborhood',
      required: [true, 'Operating neighborhood is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
providerSchema.index({ serviceType: 1, neighborhoodID: 1 });
providerSchema.index({ trustScore: -1 });
providerSchema.index({ verification: 1 });

const Provider: Model<IProvider> =
  mongoose.models.Provider || mongoose.model<IProvider>('Provider', providerSchema);

export default Provider;