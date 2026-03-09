const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Agent = require('./models/Agent');
const Lead = require('./models/Lead');

dotenv.config();

const agents = [
    { name: 'Rahul Sharma', email: 'rahul@gharpayy.com', role: 'Sales Agent' },
    { name: 'Priya Verma', email: 'priya@gharpayy.com', role: 'Sales Agent' },
    { name: 'Aniket Singh', email: 'aniket@gharpayy.com', role: 'Senior Agent' },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear existing data
        await Agent.deleteMany();
        await Lead.deleteMany();

        // Create agents
        const createdAgents = await Agent.insertMany(agents);
        console.log(`Created ${createdAgents.length} agents`);

        // Create some sample leads
        const sampleLeads = [
            {
                name: 'Suresh Kumar',
                phone: '9876543210',
                source: 'Website',
                status: 'New Lead',
                assignedAgent: createdAgents[0]._id,
                timeline: [{ action: 'Lead Captured', details: 'Web form submission', performedBy: 'System' }]
            },
            {
                name: 'Meena Iyer',
                phone: '9123456789',
                source: 'WhatsApp',
                status: 'Contacted',
                assignedAgent: createdAgents[1]._id,
                timeline: [{ action: 'Lead Captured', details: 'WhatsApp inquiry', performedBy: 'System' }]
            },
            {
                name: 'Rohan Gupta',
                phone: '9345678901',
                source: 'Social Media',
                status: 'Requirement Collected',
                assignedAgent: createdAgents[2]._id,
                timeline: [{ action: 'Requirement Collected', details: 'Budget under 15k, near HSR', performedBy: 'Aniket Singh' }]
            }
        ];

        await Lead.insertMany(sampleLeads);
        console.log('Sample leads created');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
