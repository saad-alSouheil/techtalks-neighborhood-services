# 🍃 MongoDB & Mongoose Cheat Sheet

Common queries for the Neighborhood Services application.

## 👥 Users

### Create a new User

```typescript
import User from '@/models/User';

const user = await User.create({
  userName: 'John Doe',
  email: 'john@example.com',
  password: 'hashed_password',
  phone: '123-456-7890',
  neighborhoodID: neighborhoodId, // ObjectId
  isActive: true
});
```

### Find User by Email (Login)

```typescript
const user = await User.findOne({ email: 'john@example.com' });
```

### Find Users in a Neighborhood

```typescript
const neighbors = await User.find({ neighborhoodID: id })
  .populate('neighborhoodID', 'name'); 
```

---

## 🛠️ Providers

### Find Providers by Service & Location

```typescript
import Provider from '@/models/Provider';

// Find all plumbers in "Downtown"
const plumbers = await Provider.find({
  serviceType: 'plumbing',
  neighborhoodID: downtownId
})
.populate('userID', 'userName phone') // Get contact info
.sort({ trustScore: -1 }); // Best rated first
```

### Get Provider Stats (Using Utils)

```typescript
import { getProviderStats } from '@/utils/trustScore';

const stats = await getProviderStats(providerId);
// Returns: { totalJobs, totalRatings, trustScore, ... }
```

---

## 💼 Jobs

### Create a Job Request

```typescript
import Job from '@/models/Job';

const job = await Job.create({
  userID: customerId,
  providerID: providerId,
  status: 'pending'
});
```

### Confirm a Job (Mark as Completed)

```typescript
await Job.findByIdAndUpdate(jobId, {
  status: 'completed',
  completedDate: new Date(),
  price: 150 // Final agreed price
});
```

### Check if User has Pending Jobs

```typescript
const pendingJobs = await Job.find({
  userID: userId,
  status: 'pending'
});
```

---

## ⭐ Ratings & Trust Score

### Add a Rating (And Update Score)

**Crucial:** You must update the provider's trust score manually after adding a rating!

```typescript
import Rating from '@/models/Rating';
import { updateProviderTrustScore } from '@/utils/trustScore';

// 1. Create Rating
await Rating.create({
  jobID: jobId,
  userID: customerId,
  providerID: providerId,
  reliability: 5,
  punctuality: 4,
  priceHonesty: 5,
  comment: 'Great work!'
});

// 2. Update Provider Score (REQUIRED)
await updateProviderTrustScore(providerId);
```

### Get Detailed Ratings for a Provider

```typescript
const reviews = await Rating.find({ providerID: id })
  .populate('userID', 'userName')
  .sort({ createdAt: -1 });
```

---

## 🏗️ Relationships (Populate)

### Get Full Job Details

```typescript
const job = await Job.findById(jobId)
  .populate('userID', 'userName')        // Customer details
  .populate({
    path: 'providerID',
    populate: { path: 'userID', select: 'userName' } // Provider's user details
  });
```
