const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const Assignment = require('./models/Assignment');

const mongoURI = 'mongodb+srv://vivekck12343:dmTLAoVQyOpoZvL3@cluster0.gmwvhwg.mongodb.net/test'; 

const seedDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected for seeding...');

        console.log('Dropping existing collections and clearing data...');
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

        const hashedPassword = await bcrypt.hash('password123', 12);

        const usersData = [
            // Manager Accounts
            {
                name: 'Alice Johnson',
                email: 'alice.j@example.com',
                password: hashedPassword,
                role: 'manager',
                skills: [],
                seniority: 'senior',
                maxCapacity: 100,
                department: 'Engineering Management'
            },
            {
                name: 'Priya Sharma',
                email: 'priya.s@example.com',
                password: hashedPassword,
                role: 'manager',
                skills: [],
                seniority: 'mid',
                maxCapacity: 100,
                department: 'Product Management'
            },
            // Engineer Accounts
            {
                name: 'Bob Smith',
                email: 'bob.s@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['React', 'Node.js', 'JavaScript', 'Frontend', 'GraphQL'],
                seniority: 'mid',
                maxCapacity: 100,
                department: 'Frontend'
            },
            {
                name: 'Carol White',
                email: 'carol.w@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['QA', 'Manual Testing', 'Automation', 'JIRA'],
                seniority: 'junior',
                maxCapacity: 50,
                department: 'Quality Assurance'
            },
            {
                name: 'David Green',
                email: 'david.g@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['Python', 'Django', 'AWS', 'Docker', 'SQL', 'Data Engineering'],
                seniority: 'senior',
                maxCapacity: 100,
                department: 'Backend'
            },
            {
                name: 'Eve Brown',
                email: 'eve.b@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['React', 'TypeScript', 'UI/UX', 'Figma'],
                seniority: 'mid',
                maxCapacity: 100,
                department: 'Frontend'
            },
            {
                name: 'Frank Miller',
                email: 'frank.m@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['Go', 'Kubernetes', 'Microservices', 'Cloud Architecture'],
                seniority: 'senior',
                maxCapacity: 100,
                department: 'DevOps'
            },
            {
                name: 'Rohan Gupta',
                email: 'rohan.g@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['Java', 'Spring Boot', 'Microservices', 'REST APIs'],
                seniority: 'mid',
                maxCapacity: 100,
                department: 'Backend'
            },
            {
                name: 'Neha Singh',
                email: 'neha.s@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['Angular', 'TypeScript', 'RxJS', 'Frontend Testing'],
                seniority: 'junior',
                maxCapacity: 100,
                department: 'Frontend'
            },
            {
                name: 'Ajay Kumar',
                email: 'ajay.k@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['React Native', 'Mobile Development', 'Firebase'],
                seniority: 'mid',
                maxCapacity: 50, // Part-time
                department: 'Mobile'
            },
            {
                name: 'Deepa Rao',
                email: 'deepa.r@example.com',
                password: hashedPassword,
                role: 'engineer',
                skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
                seniority: 'senior',
                maxCapacity: 100,
                department: 'AI/ML'
            }
        ];

        const createdUsers = await User.insertMany(usersData);
        console.log('Users seeded:', createdUsers.map(u => ({ name: u.name, role: u.role, _id: u._id })));

        const alice = createdUsers.find(user => user.name === 'Alice Johnson');
        const priya = createdUsers.find(user => user.name === 'Priya Sharma');
        const bob = createdUsers.find(user => user.name === 'Bob Smith');
        const carol = createdUsers.find(user => user.name === 'Carol White');
        const david = createdUsers.find(user => user.name === 'David Green');
        const eve = createdUsers.find(user => user.name === 'Eve Brown');
        const frank = createdUsers.find(user => user.name === 'Frank Miller');
        const rohan = createdUsers.find(user => user.name === 'Rohan Gupta');
        const neha = createdUsers.find(user => user.name === 'Neha Singh');
        const ajay = createdUsers.find(user => user.name === 'Ajay Kumar');
        const deepa = createdUsers.find(user => user.name === 'Deepa Rao');

        const projectsData = [
            {
                name: 'E-commerce Platform Revamp',
                description: 'Full overhaul of existing e-commerce platform with new features and modern stack.',
                startDate: new Date('2025-01-15T00:00:00Z'),
                endDate: new Date('2025-07-31T23:59:59Z'),
                requiredSkills: ['React', 'Node.js', 'MongoDB', 'AWS'],
                teamSize: 5,
                status: 'active',
                managerId: alice._id
            },
            {
                name: 'Internal Reporting Tool',
                description: 'Development of a new internal analytics and reporting dashboard for sales team.',
                startDate: new Date('2025-03-01T00:00:00Z'),
                endDate: new Date('2025-09-30T23:59:59Z'),
                requiredSkills: ['Python', 'SQL', 'Data Visualization', 'Dashboards'],
                teamSize: 3,
                status: 'planning',
                managerId: alice._id
            },
            {
                name: 'Mobile App Performance Optimization',
                description: 'Improve load times and responsiveness for the existing mobile application.',
                startDate: new Date('2024-11-01T00:00:00Z'),
                endDate: new Date('2025-02-28T23:59:59Z'),
                requiredSkills: ['React Native', 'Performance Tuning', 'Mobile Development'],
                teamSize: 4,
                status: 'completed',
                managerId: alice._id
            },
            {
                name: 'Cloud Migration Project',
                description: 'Migrate all on-premise infrastructure to Google Cloud Platform.',
                startDate: new Date('2025-06-10T00:00:00Z'),
                endDate: new Date('2025-12-20T23:59:59Z'),
                requiredSkills: ['GCP', 'DevOps', 'Kubernetes', 'Networking', 'Security'],
                teamSize: 4,
                status: 'planning',
                managerId: priya._id
            },
            {
                name: 'AI-Powered Chatbot',
                description: 'Develop a conversational AI chatbot for customer support.',
                startDate: new Date('2025-07-01T00:00:00Z'),
                endDate: new Date('2026-01-31T23:59:59Z'),
                requiredSkills: ['Python', 'Machine Learning', 'NLP', 'TensorFlow'],
                teamSize: 3,
                status: 'active',
                managerId: priya._id
            },
            {
                name: 'FinTech Dashboard Redesign',
                description: 'Modernize and enhance the user experience of an existing financial dashboard.',
                startDate: new Date('2025-05-20T00:00:00Z'),
                endDate: new Date('2025-11-15T23:59:59Z'),
                requiredSkills: ['Angular', 'TypeScript', 'UI/UX', 'Data Visualization'],
                teamSize: 4,
                status: 'active',
                managerId: alice._id
            },
            {
                name: 'Healthcare Data Analytics',
                description: 'Build a secure platform for analyzing healthcare data to identify trends.',
                startDate: new Date('2025-08-01T00:00:00Z'),
                endDate: new Date('2026-03-31T23:59:59Z'),
                requiredSkills: ['Java', 'Spring Boot', 'Big Data', 'Security'],
                teamSize: 5,
                status: 'planning',
                managerId: priya._id
            }
        ];

        const createdProjects = await Project.insertMany(projectsData);
        console.log('Projects seeded:', createdProjects.map(p => ({ name: p.name, _id: p._id })));

        const ecommerceProject = createdProjects.find(p => p.name === 'E-commerce Platform Revamp');
        const internalToolProject = createdProjects.find(p => p.name === 'Internal Reporting Tool');
        const mobileAppProject = createdProjects.find(p => p.name === 'Mobile App Performance Optimization');
        const cloudMigrationProject = createdProjects.find(p => p.name === 'Cloud Migration Project');
        const aiChatbotProject = createdProjects.find(p => p.name === 'AI-Powered Chatbot');
        const fintechProject = createdProjects.find(p => p.name === 'FinTech Dashboard Redesign');
        const healthcareProject = createdProjects.find(p => p.name === 'Healthcare Data Analytics');

        const assignmentsData = [
            // Assignments for Bob Smith
            {
                engineerId: bob._id,
                projectId: ecommerceProject._id,
                allocationPercentage: 70,
                startDate: new Date('2025-01-15T00:00:00Z'),
                endDate: new Date('2025-07-31T23:59:59Z'),
                role: 'Lead Frontend Developer'
            },
            {
                engineerId: bob._id,
                projectId: internalToolProject._id,
                allocationPercentage: 30,
                startDate: new Date('2025-03-01T00:00:00Z'),
                endDate: new Date('2025-09-30T23:59:59Z'),
                role: 'UI Contributor'
            },
            // Assignments for Carol White
            {
                engineerId: carol._id,
                projectId: ecommerceProject._id,
                allocationPercentage: 50,
                startDate: new Date('2025-02-01T00:00:00Z'),
                endDate: new Date('2025-06-30T23:59:59Z'),
                role: 'QA Engineer'
            },
            // Assignments for David Green
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
                projectId: mobileAppProject._id,
                allocationPercentage: 40,
                startDate: new Date('2024-11-01T00:00:00Z'),
                endDate: new Date('2025-02-28T23:59:59Z'),
                role: 'Performance Lead'
            },
            // Assignments for Eve Brown
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
                allocationPercentage: 20,
                startDate: new Date('2025-06-10T00:00:00Z'),
                endDate: new Date('2025-10-31T23:59:59Z'),
                role: 'UI Support'
            },
             // Assignments for Frank Miller
            {
                engineerId: frank._id,
                projectId: cloudMigrationProject._id,
                allocationPercentage: 50,
                startDate: new Date('2025-06-10T00:00:00Z'),
                endDate: new Date('2025-12-20T23:59:59Z'),
                role: 'DevOps Lead'
            },
            // Assignments for Rohan Gupta
            {
                engineerId: rohan._id,
                projectId: healthcareProject._id,
                allocationPercentage: 75,
                startDate: new Date('2025-08-01T00:00:00Z'),
                endDate: new Date('2026-03-31T23:59:59Z'),
                role: 'Java Backend Lead'
            },
            {
                engineerId: rohan._id,
                projectId: aiChatbotProject._id,
                allocationPercentage: 25,
                startDate: new Date('2025-07-15T00:00:00Z'),
                endDate: new Date('2025-12-31T23:59:59Z'),
                role: 'API Integration Specialist'
            },
            // Assignments for Neha Singh
            {
                engineerId: neha._id,
                projectId: fintechProject._id,
                allocationPercentage: 90,
                startDate: new Date('2025-05-20T00:00:00Z'),
                endDate: new Date('2025-11-15T23:59:59Z'),
                role: 'Angular Developer'
            },
            // Assignments for Ajay Kumar
            {
                engineerId: ajay._id,
                projectId: fintechProject._id, // Ajay is part-time, 50% max capacity
                allocationPercentage: 50,
                startDate: new Date('2025-05-20T00:00:00Z'),
                endDate: new Date('2025-11-15T23:59:59Z'),
                role: 'Mobile UI Dev'
            },
            // Assignments for Deepa Rao
            {
                engineerId: deepa._id,
                projectId: aiChatbotProject._id,
                allocationPercentage: 80,
                startDate: new Date('2025-07-01T00:00:00Z'),
                endDate: new Date('2026-01-31T23:59:59Z'),
                role: 'ML Engineer'
            }
        ];

        await Assignment.insertMany(assignmentsData);
        console.log('Assignments seeded.');

        console.log('Database seeding complete!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedDatabase();
