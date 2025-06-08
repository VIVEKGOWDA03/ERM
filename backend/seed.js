const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For hashing passwords
const User = require('./models/User'); // Adjust path as per your project structure (e.g., ../models/User)
const Project = require('./models/project'); // Adjust path as per your project structure
const Assignment = require('./models/assignment'); // Adjust path as per your project structure

// --- IMPORTANT: CONFIGURE YOUR MONGODB CONNECTION STRING HERE ---
// Ensure you replace 'engineering_resource_db' with your actual database name if it's different
const mongoURI = 'mongodb+srv://vivekck12343:dmTLAoVQyOpoZvL3@cluster0.gmwvhwg.mongodb.net/test'; 

// Function to seed the database
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            // useNewUrlParser and useUnifiedTopology are deprecated in newer Mongoose versions,
            // but harmless to keep. The driver will ignore them.
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected for seeding...');

        // --- IMPORTANT: Clear existing data and drop collections to remove old indexes ---
        console.log('Dropping existing collections and clearing data...');
        // Drop collections to ensure all existing indexes (including old ones like userName_1) are removed
        // The .catch() handles cases where the collection might not exist yet, preventing errors on first run.
        await User.collection.drop().catch(err => {
            if (err.code !== 26) console.error(`Error dropping User collection: ${err.message}`);
        });
        await Project.collection.drop().catch(err => {
            if (err.code !== 26) console.error(`Error dropping Project collection: ${err.message}`);
        });
        await Assignment.collection.drop().catch(err => {
            if (err.code !== 26) console.error(`Error dropping Assignment collection: ${err.message}`);
        });
        console.log('Existing collections dropped.');


        // --- 1. Create Users (Managers and Engineers) ---
        // Hash a common password for all users for simplicity in seeding
        const hashedPassword = await bcrypt.hash('password123', 12); // Password will be 'password123' for all seeded users

        const usersData = [
            // Manager
            {
                name: 'Alice Johnson',
                email: 'alice.j@example.com',
                password: hashedPassword,
                role: 'manager',
                skills: [], // Managers don't typically have engineering skills for assignments
                seniority: 'senior',
                maxCapacity: 100, // Manager capacity is generally irrelevant for resource allocation
                department: 'Engineering Management'
            },
            // Engineers (Full-time & Part-time, various skills)
            {
                name: 'Bob Smith',
                email: 'bob.s@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['React', 'Node.js', 'JavaScript', 'Frontend', 'GraphQL'],
                seniority: 'mid',
                maxCapacity: 100, // Full-time engineer
                department: 'Frontend'
            },
            {
                name: 'Carol White',
                email: 'carol.w@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['QA', 'Manual Testing', 'Automation', 'JIRA'],
                seniority: 'junior',
                maxCapacity: 50, // Part-time engineer (50% capacity)
                department: 'Quality Assurance'
            },
            {
                name: 'David Green',
                email: 'david.g@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['Python', 'Django', 'AWS', 'Docker', 'SQL', 'Data Engineering'],
                seniority: 'senior',
                maxCapacity: 100, // Full-time engineer
                department: 'Backend'
            },
            {
                name: 'Eve Brown',
                email: 'eve.b@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['React', 'TypeScript', 'UI/UX', 'Figma'],
                seniority: 'mid',
                maxCapacity: 100, // Full-time engineer
                department: 'Frontend'
            },
            {
                name: 'Frank Miller',
                email: 'frank.m@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['Go', 'Kubernetes', 'Microservices', 'Cloud Architecture'],
                seniority: 'senior',
                maxCapacity: 100, // Full-time engineer
                department: 'DevOps'
            }
        ];

        // Insert users into the database
        const createdUsers = await User.insertMany(usersData);
        console.log('Users seeded:', createdUsers.map(u => ({ name: u.name, role: u.role, _id: u._id })));

        // Retrieve the created user objects for their _id
        const alice = createdUsers.find(user => user.name === 'Alice Johnson');
        const bob = createdUsers.find(user => user.name === 'Bob Smith');
        const carol = createdUsers.find(user => user.name === 'Carol White');
        const david = createdUsers.find(user => user.name === 'David Green');
        const eve = createdUsers.find(user => user.name === 'Eve Brown');
        const frank = createdUsers.find(user => user.name === 'Frank Miller');


        // --- 2. Create Projects ---
        const projectsData = [
            {
                name: 'E-commerce Platform Revamp',
                description: 'Full overhaul of existing e-commerce platform with new features and modern stack.',
                startDate: new Date('2025-01-15T00:00:00Z'),
                endDate: new Date('2025-07-31T23:59:59Z'),
                requiredSkills: ['React', 'Node.js', 'MongoDB', 'AWS'],
                teamSize: 5,
                status: 'active',
                managerId: alice._id // Assign to Alice
            },
            {
                name: 'Internal Reporting Tool',
                description: 'Development of a new internal analytics and reporting dashboard for sales team.',
                startDate: new Date('2025-03-01T00:00:00Z'),
                endDate: new Date('2025-09-30T23:59:59Z'),
                requiredSkills: ['Python', 'SQL', 'Data Visualization', 'Dashboards'],
                teamSize: 3,
                status: 'planning',
                managerId: alice._id // Assign to Alice
            },
            {
                name: 'Mobile App Performance Optimization',
                description: 'Improve load times and responsiveness for the existing mobile application (completed).',
                startDate: new Date('2024-11-01T00:00:00Z'),
                endDate: new Date('2025-02-28T23:59:59Z'), // Already completed
                requiredSkills: ['React Native', 'Performance Tuning', 'Mobile Development'],
                teamSize: 4,
                status: 'completed',
                managerId: alice._id // Assign to Alice
            },
            {
                name: 'Cloud Migration Project',
                description: 'Migrate all on-premise infrastructure to Google Cloud Platform.',
                startDate: new Date('2025-06-10T00:00:00Z'),
                endDate: new Date('2025-12-20T23:59:59Z'),
                requiredSkills: ['GCP', 'DevOps', 'Kubernetes', 'Networking', 'Security'],
                teamSize: 4,
                status: 'planning',
                managerId: alice._id // Assign to Alice
            }
        ];

        // Insert projects into the database
        const createdProjects = await Project.insertMany(projectsData);
        console.log('Projects seeded:', createdProjects.map(p => ({ name: p.name, _id: p._id })));

        // Retrieve the created project objects for their _id
        const ecommerceProject = createdProjects.find(p => p.name === 'E-commerce Platform Revamp');
        const internalToolProject = createdProjects.find(p => p.name === 'Internal Reporting Tool');
        const mobileAppProject = createdProjects.find(p => p.name === 'Mobile App Performance Optimization');
        const cloudMigrationProject = createdProjects.find(p => p.name === 'Cloud Migration Project');


        // --- 3. Create Assignments ---
        const assignmentsData = [
            // Bob Smith (mid, 100% capacity)
            {
                engineerId: bob._id,
                projectId: ecommerceProject._id,
                allocationPercentage: 70, // 70% allocated
                startDate: new Date('2025-01-15T00:00:00Z'),
                endDate: new Date('2025-07-31T23:59:59Z'),
                role: 'Lead Frontend Developer'
            },
            {
                engineerId: bob._id,
                projectId: internalToolProject._id,
                allocationPercentage: 30, // Puts Bob at 100% total (70+30)
                startDate: new Date('2025-03-01T00:00:00Z'),
                endDate: new Date('2025-09-30T23:59:59Z'),
                role: 'UI Contributor'
            },
            // Carol White (junior, 50% capacity - part-time)
            {
                engineerId: carol._id,
                projectId: ecommerceProject._id,
                allocationPercentage: 50, // Carol is part-time, so 50% fills her max capacity
                startDate: new Date('2025-02-01T00:00:00Z'),
                endDate: new Date('2025-06-30T23:59:59Z'),
                role: 'QA Engineer'
            },
            {
                engineerId: david._id,
                projectId: internalToolProject._id,
                allocationPercentage: 60,
                startDate: new Date('2025-03-10T00:00:00Z'),
                endDate: new Date('2025-09-30T23:59:59Z'),
                role: 'Backend Developer'
            },
            {
                engineerId: david._id,
                projectId: mobileAppProject._id, // This is a completed project, good for historical data
                allocationPercentage: 40,
                startDate: new Date('2024-11-01T00:00:00Z'),
                endDate: new Date('2025-02-28T23:59:59Z'),
                role: 'Performance Lead'
            },
            // Eve Brown (mid, 100% capacity)
            {
                engineerId: eve._id,
                projectId: ecommerceProject._id,
                allocationPercentage: 80,
                startDate: new Date('2025-04-01T00:00:00Z'),
                endDate: new Date('2025-08-31T23:59:59Z'),
                role: 'React Developer'
            },
            {
                engineerId: eve._id,
                projectId: cloudMigrationProject._id,
                allocationPercentage: 20, // Puts Eve at 100% total (80+20) with a future project
                startDate: new Date('2025-06-10T00:00:00Z'),
                endDate: new Date('2025-10-31T23:59:59Z'),
                role: 'UI Support'
            },
             // Frank Miller (senior, 100% capacity) - partially allocated
            {
                engineerId: frank._id,
                projectId: cloudMigrationProject._id,
                allocationPercentage: 50,
                startDate: new Date('2025-06-10T00:00:00Z'),
                endDate: new Date('2025-12-20T23:59:59Z'),
                role: 'DevOps Lead'
            }
        ];

        // Insert assignments into the database
        await Assignment.insertMany(assignmentsData);
        console.log('Assignments seeded.');

        console.log('Database seeding complete!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

// Execute the seeding function
seedDatabase();
