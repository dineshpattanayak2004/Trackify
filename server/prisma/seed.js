import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import process from 'process';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
  const adminPassword = await hashPassword('adminpass');
  const userPassword = await hashPassword('userpass');

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trackify.test' },
    update: {},
    create: {
      email: 'admin@trackify.test',
      password: adminPassword,
      name: 'Admin',
      role: 'admin',
    },
  });
  console.log('Admin user created:', admin.email, '| role:', admin.role);

  // Create or update regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@trackify.test' },
    update: {},
    create: {
      email: 'user@trackify.test',
      password: userPassword,
      name: 'User',
      role: 'user',
    },
  });
  console.log('Regular user created:', user.email, '| role:', user.role);

  const distributorPassword = await hashPassword('distpass');
  const distributor1 = await prisma.distributor.upsert({
    where: { email: 'distributor@trackify.test' },
    update: {},
    create: {
      email: 'distributor@trackify.test',
      password: distributorPassword,
      name: 'Test Distributor',
      company: 'Test Distribution Co.',
      phone: '9876543210',
      address: '123 Test Street, Test City',
      status: 'active',
    },
  });
  console.log('Distributor created:', distributor1.email, '| company:', distributor1.company);

  const distributor2 = await prisma.distributor.upsert({
    where: { email: 'techdistro@trackify.test' },
    update: {},
    create: {
      email: 'techdistro@trackify.test',
      password: distributorPassword,
      name: 'TechDistro Pvt Ltd',
      company: 'TechDistro Pvt Ltd',
      phone: '9876543211',
      address: '456 Tech Park, Bangalore',
      status: 'active',
    },
  });
  console.log('Distributor created:', distributor2.email, '| company:', distributor2.company);

  const distributor3 = await prisma.distributor.upsert({
    where: { email: 'softwaresolutions@trackify.test' },
    update: {},
    create: {
      email: 'softwaresolutions@trackify.test',
      password: distributorPassword,
      name: 'Software Solutions Inc',
      company: 'Software Solutions Inc',
      phone: '9876543212',
      address: '789 Software Hub, Hyderabad',
      status: 'active',
    },
  });
  console.log('Distributor created:', distributor3.email, '| company:', distributor3.company);

  console.log('\nClearing existing products and selections...');
  await prisma.distributorProductSelection.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  console.log('✓ Cleared existing data');

  console.log('\nCreating 24 unique products...');

  const dist1ProductsData = [
    { name: 'Trackify Pro License', category: 'Software', price: 2999, stock: 50, rating: 4.8, image: '📦', description: 'Full CRM suite with AI agent, analytics, and unlimited leads.' },
    { name: 'Trackify Starter Pack', category: 'Software', price: 999, stock: 120, rating: 4.5, image: '🚀', description: 'Basic CRM with lead management and reports.' },
    { name: 'Premium Support Plan', category: 'Service', price: 599, stock: 999, rating: 4.9, image: '🎧', description: '24/7 priority support with dedicated manager.' },
    { name: 'Data Backup & Recovery', category: 'Service', price: 1499, stock: 200, rating: 4.6, image: '💾', description: 'Automated data backup and disaster recovery solution.' },
    { name: 'Email Marketing Suite', category: 'Add-on', price: 1299, stock: 180, rating: 4.4, image: '📧', description: 'Professional email marketing with analytics and templates.' },
    { name: 'Custom Domain Setup', category: 'Service', price: 499, stock: 500, rating: 4.3, image: '🌐', description: 'Custom domain configuration with SSL certificate.' },
    { name: 'Multi-User Access Pack', category: 'Feature', price: 1999, stock: 100, rating: 4.7, image: '👨‍👩‍👧‍👦', description: 'Add up to 20 team members with role-based access.' },
    { name: 'Payment Gateway Integration', category: 'Add-on', price: 2499, stock: 60, rating: 4.8, image: '💳', description: 'Seamless payment gateway with 10+ payment options.' },
  ];

  const dist2ProductsData = [
    { name: 'AI Chatbot Assistant', category: 'Feature', price: 4999, stock: 30, rating: 4.9, image: '🤖', description: 'Intelligent AI chatbot for customer support automation.' },
    { name: 'Social Media Manager', category: 'Add-on', price: 1799, stock: 85, rating: 4.5, image: '📱', description: 'Schedule, manage, and analyze social media posts.' },
    { name: 'Lead Scoring Engine', category: 'Feature', price: 2999, stock: 45, rating: 4.6, image: '🎯', description: 'AI-powered lead scoring with predictive analytics.' },
    { name: 'Video Conferencing Pro', category: 'Add-on', price: 899, stock: 200, rating: 4.3, image: '📹', description: 'HD video conferencing with recording and screen share.' },
    { name: 'Invoice Generation Tool', category: 'Feature', price: 699, stock: 300, rating: 4.4, image: '🧾', description: 'Auto-generate invoices and send payment reminders.' },
    { name: 'Zapier Integration Pack', category: 'Add-on', price: 1999, stock: 90, rating: 4.7, image: '⚡', description: 'Connect with 5000+ apps via Zapier integration.' },
    { name: 'Workflow Automation', category: 'Feature', price: 3499, stock: 40, rating: 4.8, image: '🔄', description: 'Automate repetitive tasks with custom workflows.' },
    { name: 'GDPR Compliance Toolkit', category: 'Add-on', price: 3999, stock: 25, rating: 4.9, image: '🛡️', description: 'Complete GDPR compliance with consent management.' },
  ];

  const dist3ProductsData = [
    { name: 'Cloud Storage 1TB', category: 'Add-on', price: 2499, stock: 300, rating: 4.3, image: '☁️', description: 'Secure cloud storage with 1TB space and 24/7 access.' },
    { name: 'Security Suite Pro', category: 'Software', price: 3999, stock: 40, rating: 4.9, image: '🔒', description: 'Advanced security with encryption, firewall, threat detection.' },
    { name: 'Team Collaboration Tools', category: 'Feature', price: 799, stock: 150, rating: 4.4, image: '👥', description: 'Real-time team chat, file sharing, task assignment.' },
    { name: 'Analytics Dashboard Pro', category: 'Add-on', price: 1999, stock: 75, rating: 4.6, image: '📊', description: 'Advanced analytics with custom reports and charts.' },
    { name: 'Slack Integration', category: 'Add-on', price: 599, stock: 250, rating: 4.5, image: '💬', description: 'Direct Slack integration for real-time notifications.' },
    { name: 'HR Management Module', category: 'Feature', price: 4499, stock: 20, rating: 4.7, image: '👔', description: 'Complete HR management with payroll and attendance.' },
    { name: 'Project Roadmap Tool', category: 'Feature', price: 1499, stock: 60, rating: 4.6, image: '🗺️', description: 'Visual project planning with timeline and milestones.' },
    { name: 'Smart Notification System', category: 'Add-on', price: 399, stock: 500, rating: 4.2, image: '🔔', description: 'Multi-channel notifications via email, SMS, and push.' },
  ];

  const allCreatedProducts = [];
  for (const productData of [...dist1ProductsData, ...dist2ProductsData, ...dist3ProductsData]) {
    const product = await prisma.product.create({ data: productData });
    allCreatedProducts.push(product);
  }
  console.log(`✓ Created ${allCreatedProducts.length} products (8 per distributor, no overlap)`);

  console.log('\nCreating distributor product selections (no overlap)...');
  
  for (let i = 0; i < 8; i++) {
    await prisma.distributorProductSelection.upsert({
      where: {
        distributorId_productId: {
          distributorId: distributor1.id,
          productId: allCreatedProducts[i].id,
        },
      },
      update: {},
      create: {
        distributorId: distributor1.id,
        productId: allCreatedProducts[i].id,
      },
    });
  }
  console.log(`✓ Assigned 8 products to ${distributor1.company}`);

  for (let i = 8; i < 16; i++) {
    await prisma.distributorProductSelection.upsert({
      where: {
        distributorId_productId: {
          distributorId: distributor2.id,
          productId: allCreatedProducts[i].id,
        },
      },
      update: {},
      create: {
        distributorId: distributor2.id,
        productId: allCreatedProducts[i].id,
      },
    });
  }
  console.log(`✓ Assigned 8 products to ${distributor2.company}`);

  for (let i = 16; i < 24; i++) {
    await prisma.distributorProductSelection.upsert({
      where: {
        distributorId_productId: {
          distributorId: distributor3.id,
          productId: allCreatedProducts[i].id,
        },
      },
      update: {},
      create: {
        distributorId: distributor3.id,
        productId: allCreatedProducts[i].id,
      },
    });
  }
  console.log(`✓ Assigned 8 products to ${distributor3.company}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });