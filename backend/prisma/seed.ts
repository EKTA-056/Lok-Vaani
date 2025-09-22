import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding business categories...');

  // Business categories with their weightage scores
  const businessCategories = [
    { name: 'Corporate Debtor', weightageScore: 0.8, categoryType: 'BUSINESS' },
    { name: 'Creditor to a Corporate Debtor', weightageScore: 1.0, categoryType: 'BUSINESS' },
    { name: 'Insolvency Professional', weightageScore: 1.5, categoryType: 'BUSINESS' },
    { name: 'Insolvency Professional Agency', weightageScore: 1.2, categoryType: 'BUSINESS' },
    { name: 'Insolvency Professional Entity', weightageScore: 1.2, categoryType: 'BUSINESS' },
    { name: 'Personal Guarantor', weightageScore: 0.8, categoryType: 'BUSINESS' },
    { name: 'Proprietorship firms', weightageScore: 1.0, categoryType: 'BUSINESS' },
    { name: 'Partnership firms', weightageScore: 1.0, categoryType: 'BUSINESS' },
    { name: 'Academics', weightageScore: 1.1, categoryType: 'BUSINESS' },
    { name: 'Investors', weightageScore: 1.3, categoryType: 'BUSINESS' },
    { name: 'Others', weightageScore: 0.5, categoryType: 'BUSINESS' },
    { name: 'User', weightageScore: 0.5, categoryType: 'USER' },
  ];

  for (const category of businessCategories) {
    await prisma.businessCategory.upsert({
      where: { name: category.name },
      update: {
        weightageScore: category.weightageScore,
        categoryType: category.categoryType,
      },
      create: {
        name: category.name,
        weightageScore: category.weightageScore,
        categoryType: category.categoryType,
      },
    });
  }

  console.log('✅ Business categories seeded successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });