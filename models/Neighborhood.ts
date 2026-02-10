import mongoose, { Schema, Model } from 'mongoose';
import { INeighborhood } from '../types';

const neighborhoodSchema = new Schema<INeighborhood>(
  {
    name: {
      type: String,
      required: [true, 'Neighborhood name is required'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for location-based search
neighborhoodSchema.index({ name: 1, city: 1 });
neighborhoodSchema.index({ city: 1 });

const Neighborhood: Model<INeighborhood> =
  mongoose.models.Neighborhood || mongoose.model<INeighborhood>('Neighborhood', neighborhoodSchema);

export default Neighborhood;
