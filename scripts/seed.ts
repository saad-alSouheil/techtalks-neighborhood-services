import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Neighborhood from '../models/Neighborhood';
import User from '../models/User';
import Provider from '../models/Provider';
import Job from '../models/Job';
import Rating from '../models/Rating';
import { ServiceType, JobStatus } from '../types';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neighborhood-services';

async function seed() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);

        console.log('🧹 Clearing existing data...');
        await Rating.deleteMany({});
        await Job.deleteMany({});
        await Provider.deleteMany({});
        await User.deleteMany({});
        await Neighborhood.deleteMany({});

        console.log('qh Creating Neighborhoods...');
        const neighborhoodsData = [
            // Beirut
            { name: 'Hamra', city: 'Beirut' },
            { name: 'Achrafieh', city: 'Beirut' },
            { name: 'Verdun', city: 'Beirut' },
            { name: 'Ras Beirut', city: 'Beirut' },
            { name: 'Mar Mikhael', city: 'Beirut' },
            { name: 'Downtown', city: 'Beirut' },
            { name: 'Badaro', city: 'Beirut' },

            // Tripoli
            { name: 'El Mina', city: 'Tripoli' },
            { name: 'Dam & Farez', city: 'Tripoli' },
            { name: 'Azmi', city: 'Tripoli' },

            // Jounieh & Metn
            { name: 'Kaslik', city: 'Jounieh' },
            { name: 'Sarba', city: 'Jounieh' },
            { name: 'Jal El Dib', city: 'Metn' },
            { name: 'Antelias', city: 'Metn' },
            { name: 'Dbayeh', city: 'Metn' },
            { name: 'Broummana', city: 'Metn' },

            // South
            { name: 'Saida', city: 'Sidon' },
            { name: 'Tyre', city: 'Sour' },
        ];

        const neighborhoods = await Neighborhood.insertMany(neighborhoodsData);
        console.log(`✅ Created ${neighborhoods.length} neighborhoods.`);

        // Helper to get random neighborhood
        const getRandomNeighborhood = () => neighborhoods[Math.floor(Math.random() * neighborhoods.length)];

        console.log('👤 Creating Users...');
        const usersData = [
            { userName: 'Fadi Haddad', email: 'fadi.haddad@example.com', phone: '+961 3 111222' },
            { userName: 'Layla Khoury', email: 'layla.khoury@example.com', phone: '+961 70 333444' },
            { userName: 'Rami Aoun', email: 'rami.aoun@example.com', phone: '+961 71 555666' },
            { userName: 'Ziad Rahbani', email: 'ziad.rahbani@example.com', phone: '+961 3 777888' },
            { userName: 'Maya Diab', email: 'maya.diab@example.com', phone: '+961 76 999000' },
            { userName: 'Charbel Makhlouf', email: 'charbel.makhlouf@example.com', phone: '+961 81 123123' },
            { userName: 'Naji Gebran', email: 'naji.gebran@example.com', phone: '+961 3 456456' },
            { userName: 'Samar Salameh', email: 'samar.salameh@example.com', phone: '+961 70 789789' },
            { userName: 'Tarek Soueid', email: 'tarek.soueid@example.com', phone: '+961 71 101101' },
            { userName: 'Hala Fakih', email: 'hala.fakih@example.com', phone: '+961 76 202202' },
            { userName: 'Jad Choueiri', email: 'jad.choueiri@example.com', phone: '+961 3 303303' },
            { userName: 'Nour Aridi', email: 'nour.aridi@example.com', phone: '+961 81 404404' },
            { userName: 'Wassim Nader', email: 'wassim.nader@example.com', phone: '+961 70 505505' },
            { userName: 'Rima Kanaan', email: 'rima.kanaan@example.com', phone: '+961 71 606606' },
            { userName: 'Georges Metni', email: 'georges.metni@example.com', phone: '+961 3 707707' },
            { userName: 'Ahmad Shams', email: 'ahmad.shams@example.com', phone: '+961 76 808808' },
            { userName: 'Sanaa Moughrabi', email: 'sanaa.moughrabi@example.com', phone: '+961 81 909909' },
            { userName: 'Elie Bassil', email: 'elie.bassil@example.com', phone: '+961 70 121121' },
            { userName: 'Mona Zaki', email: 'mona.zaki@example.com', phone: '+961 71 131131' },
            { userName: 'Karim Nasr', email: 'karim.nasr@example.com', phone: '+961 3 141141' },
        ];

        // Create a hashed password for all users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        console.log('🔐 Default password for all users: password123');

        const users = await Promise.all(usersData.map(async (userData, index) => {
            // Assign neighborhoods in a semi-distributed way
            const neighborhood = neighborhoods[index % neighborhoods.length];
            return User.create({
                ...userData,
                password: hashedPassword,
                neighborhoodID: neighborhood._id,
                isActive: true,
                isProvider: index >= 5, // Make the last 15 users providers/potential providers
            });
        }));

        console.log(`✅ Created ${users.length} users.`);

        console.log('🛠️ Creating Providers...');
        const providersData = [
            // Plumbers
            {
                userIndex: 5,
                serviceType: 'plumbing',
                description: 'Professional plumbing services for all your needs. Leaks, pipes, and installations.',
                trustScore: 4.8
            },
            {
                userIndex: 6,
                serviceType: 'plumbing',
                description: 'Fast and reliable plumber in Beirut area. 24/7 availability.',
                trustScore: 4.5
            },

            // Electricians
            {
                userIndex: 7,
                serviceType: 'electrical',
                description: 'Certified electrical engineer for home and office repairs.',
                trustScore: 4.9
            },
            {
                userIndex: 8,
                serviceType: 'electrical',
                description: 'General electrical maintenance and generator hookups.',
                trustScore: 4.2
            },

            // Carpenters
            {
                userIndex: 9,
                serviceType: 'carpentry',
                description: 'Custom furniture and wood repairs. High quality craftsmanship.',
                trustScore: 4.7
            },

            // Painters
            {
                userIndex: 10,
                serviceType: 'painting',
                description: 'Interior and exterior painting. Clean and professional work.',
                trustScore: 4.6
            },
            {
                userIndex: 11,
                serviceType: 'painting',
                description: 'Artistic wall painting and renovation.',
                trustScore: 4.3
            },

            // Cleaning
            {
                userIndex: 12,
                serviceType: 'cleaning',
                description: 'Deep cleaning for homes and offices. Trusted team.',
                trustScore: 4.9
            },
            {
                userIndex: 13,
                serviceType: 'cleaning',
                description: 'Carpet and sofa cleaning services.',
                trustScore: 4.4
            },

            // HVAC
            {
                userIndex: 14,
                serviceType: 'hvac',
                description: 'AC installation and repair split units.',
                trustScore: 4.7
            },

            // Handyman
            {
                userIndex: 15,
                serviceType: 'handyman',
                description: 'Jack of all trades for quick home fixes.',
                trustScore: 4.5
            },
            {
                userIndex: 16,
                serviceType: 'handyman',
                description: 'Reliable handyman for small to medium jobs.',
                trustScore: 4.1
            },

            // Moving
            {
                userIndex: 17,
                serviceType: 'moving',
                description: 'Furniture moving and truck services.',
                trustScore: 4.6
            },

            // Satellite/Dish (using 'other' or maybe electrical/handyman, let's Stick to defined types)
            {
                userIndex: 18,
                serviceType: 'appliance-repair',
                description: 'Repairing washing machines, fridges, and ovens.',
                trustScore: 4.8
            },

            // Pest Control
            {
                userIndex: 19,
                serviceType: 'pest-control',
                description: 'Effective pest control services against cockroaches and ants.',
                trustScore: 4.7
            },
        ];

        const providers = await Promise.all(providersData.map(async (providerData) => {
            const user = users[providerData.userIndex];
            // Provider operates in the same neighborhood they live in, or a random one
            const neighborhood = Math.random() > 0.3 ? user.neighborhoodID : getRandomNeighborhood()._id;

            return Provider.create({
                userID: user._id,
                serviceType: providerData.serviceType as ServiceType,
                description: providerData.description,
                neighborhoodID: neighborhood,
                trustScore: providerData.trustScore,
                verification: providerData.trustScore > 4.5, // Verify high rated ones
            });
        }));

        console.log(`✅ Created ${providers.length} providers.`);

        // --- Create Jobs and Ratings ---
        console.log('💼 Creating Jobs and Ratings...');

        const jobsData = [];
        const ratingsData = [];
        const usersForJobs = users.filter(user => !providers.find(p => p.userID.toString() === user._id.toString())); // Users who are not providers

        // Generate jobs for each provider
        for (const provider of providers) {
            // 3-10 jobs per provider
            const numberOfJobs = Math.floor(Math.random() * 8) + 3;

            for (let i = 0; i < numberOfJobs; i++) {
                // Pick a random user (customer)
                const customer = usersForJobs[Math.floor(Math.random() * usersForJobs.length)] || users[0];

                // Determine job status (weighted towards completed)
                const statusRoll = Math.random();
                let status: JobStatus = 'completed';
                if (statusRoll < 0.1) status = 'cancelled';
                else if (statusRoll < 0.2) status = 'pending';
                else if (statusRoll < 0.3) status = 'confirmed';

                // Create job date (past 6 months)
                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 180));

                const job = {
                    userID: customer._id,
                    providerID: provider._id,
                    status: status,
                    price: Math.floor(Math.random() * 200) + 50, // Price between 50 and 250
                    completedDate: status === 'completed' ? date : undefined,
                    createdAt: date,
                    updatedAt: date
                };

                jobsData.push(job);
            }
        }

        const createdJobs = await Job.insertMany(jobsData);
        console.log(`✅ Created ${createdJobs.length} jobs.`);

        // Create ratings for completed jobs
        const completedJobs = createdJobs.filter(job => job.status === 'completed');

        for (const job of completedJobs) {
            // 80% chance to rate a completed job
            if (Math.random() > 0.2) {
                const ratingValue = Math.floor(Math.random() * 2) + 4; // Mostly 4 or 5 stars

                ratingsData.push({
                    jobID: job._id,
                    userID: job.userID,
                    providerID: job.providerID,
                    reliability: ratingValue, // 4-5
                    punctuality: Math.random() > 0.8 ? 5 : (Math.random() > 0.5 ? 4 : 3),
                    priceHonesty: Math.random() > 0.9 ? 5 : 4,
                    comment: [
                        "Great service, highly recommended!",
                        "Very professional and punctual.",
                        "Good work but a bit expensive.",
                        "Did an amazing job, will hire again.",
                        "Efficient and clean work.",
                        "Arrived on time and fixed the issue quickly.",
                        "Excellent communication and service.",
                        "Friendly and knowledgeable provider."
                    ][Math.floor(Math.random() * 8)],
                    createdAt: job.completedDate || new Date()
                });
            }
        }

        await Rating.insertMany(ratingsData);
        console.log(`✅ Created ${ratingsData.length} ratings.`);

        // Recalculate trust scores for providers based on new ratings
        console.log('🔄 Updating Provider Trust Scores...');
        for (const provider of providers) {
            const providerRatings = ratingsData.filter(r => r.providerID.toString() === provider._id.toString());
            if (providerRatings.length > 0) {
                const totalScore = providerRatings.reduce((sum, r) => sum + ((r.reliability + r.punctuality + r.priceHonesty) / 3), 0);
                const avgScore = totalScore / providerRatings.length;
                await Provider.findByIdAndUpdate(provider._id, { trustScore: parseFloat(avgScore.toFixed(1)) });
            }
        }

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seed();
