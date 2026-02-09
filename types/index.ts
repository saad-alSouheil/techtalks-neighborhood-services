import { Document, Types } from 'mongoose';

// Neighborhood Types
export interface INeighborhood extends Document {
  _id: Types.ObjectId;
  name: string;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId;
  userName: string;
  phone: string;
  neighborhoodID: Types.ObjectId;
  password: string; // For authentication
  email: string; // For authentication/contact
  isActive: boolean;
  isProvider: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Provider Types
export type ServiceType =
  | 'plumbing'
  | 'electrical'
  | 'carpentry'
  | 'painting'
  | 'cleaning'
  | 'gardening'
  | 'hvac'
  | 'roofing'
  | 'handyman'
  | 'moving'
  | 'appliance-repair'
  | 'pest-control'
  | 'other';

export interface IProvider extends Document {
  _id: Types.ObjectId;
  userID: Types.ObjectId; // FK to User
  serviceType: ServiceType;
  description?: string;
  trustScore: number; // Calculated from ratings
  verification: boolean; // Verified by platform
  neighborhoodID: Types.ObjectId; // FK to Neighborhood (where they operate)
  createdAt: Date;
  updatedAt: Date;
}

// Job Types
export type JobStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface IJob extends Document {
  _id: Types.ObjectId;
  userID: Types.ObjectId; // FK to User (customer)
  providerID: Types.ObjectId; // FK to Provider
  status: JobStatus;
  price?: number; // Agreed service price
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Rating Types
export interface IRating extends Document {
  _id: Types.ObjectId;
  jobID: Types.ObjectId; // FK to Job
  userID: Types.ObjectId; // FK to User (who rated)
  providerID: Types.ObjectId; // FK to Provider (who was rated)
  reliability: number; // 1-5
  punctuality: number; // 1-5
  priceHonesty: number; // 1-5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Populated Types (for queries with .populate())
export interface IUserPopulated extends Omit<IUser, 'neighborhoodID'> {
  neighborhoodID: INeighborhood;
}

export interface IProviderPopulated extends Omit<IProvider, 'userID' | 'neighborhoodID'> {
  userID: IUser;
  neighborhoodID: INeighborhood;
}

export interface IJobPopulated extends Omit<IJob, 'userID' | 'providerID'> {
  userID: IUser;
  providerID: IProvider;
}

export interface IRatingPopulated extends Omit<IRating, 'jobID' | 'userID' | 'providerID'> {
  jobID: IJob;
  userID: IUser;
  providerID: IProvider;
}