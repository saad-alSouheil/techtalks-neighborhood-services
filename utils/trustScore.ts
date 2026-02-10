import { Types } from 'mongoose';
import Provider from '../models/Provider';
import Rating from '../models/Rating';
import Job from '../models/Job';

/**
 * Calculate and update a provider's trust score based on all their ratings
 * Trust Score = Average of (reliability + punctuality + priceHonesty) / 3
 * 
 * @param providerID - The provider's MongoDB ObjectId
 * @returns Updated trust score (0-5)
 */
export async function updateProviderTrustScore(
  providerID: string | Types.ObjectId
): Promise<number> {
  try {
    // Get all ratings for this provider
    const ratings = await Rating.find({ providerID });

    if (ratings.length === 0) {
      // No ratings yet, set trust score to 0
      await Provider.findByIdAndUpdate(providerID, { trustScore: 0 });
      return 0;
    }

    // Calculate average of all three rating categories
    const totals = ratings.reduce(
      (acc, rating) => {
        acc.reliability += rating.reliability;
        acc.punctuality += rating.punctuality;
        acc.priceHonesty += rating.priceHonesty;
        return acc;
      },
      { reliability: 0, punctuality: 0, priceHonesty: 0 }
    );

    const count = ratings.length;
    
    // Trust Score = Average of (reliability + punctuality + priceHonesty)
    const avgReliability = totals.reliability / count;
    const avgPunctuality = totals.punctuality / count;
    const avgPriceHonesty = totals.priceHonesty / count;
    
    const trustScore = Number(
      ((avgReliability + avgPunctuality + avgPriceHonesty) / 3).toFixed(2)
    );

    // Update provider with new trust score
    await Provider.findByIdAndUpdate(providerID, { trustScore });

    return trustScore;
  } catch (error) {
    console.error('Error updating trust score:', error);
    throw error;
  }
}

/**
 * Get provider statistics
 * @param providerID - The provider's MongoDB ObjectId
 * @returns Provider stats
 */
export async function getProviderStats(providerID: string | Types.ObjectId) {
  try {
    const [totalJobs, totalRatings, completedJobs, provider] = await Promise.all([
      Job.countDocuments({ providerID }),
      Rating.countDocuments({ providerID }),
      Job.countDocuments({ providerID, status: 'completed' }),
      Provider.findById(providerID),
    ]);

    if (!provider) {
      throw new Error('Provider not found');
    }

    return {
      totalJobs,
      totalRatings,
      completedJobs,
      pendingJobs: totalJobs - completedJobs,
      trustScore: provider.trustScore,
      verification: provider.verification,
      ratingRate: totalJobs > 0 ? ((totalRatings / completedJobs) * 100).toFixed(1) : '0',
    };
  } catch (error) {
    console.error('Error getting provider stats:', error);
    throw error;
  }
}

/**
 * Check if a job can be rated
 * Rules: Job must be completed and not already rated
 * 
 * @param jobID - The job's MongoDB ObjectId
 * @returns Boolean indicating if job can be rated
 */
export async function canRateJob(jobID: string | Types.ObjectId): Promise<boolean> {
  try {
    const job = await Job.findById(jobID);
    
    if (!job) {
      throw new Error('Job not found');
    }

    if (job.status !== 'completed') {
      return false;
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({ jobID });
    
    return !existingRating;
  } catch (error) {
    console.error('Error checking if job can be rated:', error);
    throw error;
  }
}

//note: dont forget to add this to your api aw l score will never change
// Example API Logic (Mental Check)
//await Rating.create(ratingData);
//await updateProviderTrustScore(providerId); // <--- You MUST call this manually!