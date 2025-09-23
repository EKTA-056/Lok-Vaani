// bulkInsertCompanies.ts
// Usage: npx ts-node bulkInsertCompanies.ts

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Mapping from category name to businessCategoryId
const categoryMap: Record<string, string> = {
  'Corporate Debtor': '094fadba-4eca-4713-bbfb-b59193d58a32',
  'Personal Guarantor to a Corporate Debtor': '2ca7f9b5-aad9-4f2f-bfd5-3373f38a799e',
  'Investors': '30289d7b-8df7-48af-969d-24dbe29c3062',
  'Insolvency Professional Entity': '4a95fb41-326b-42c1-a860-7b85c6cfb9e2',
  'Partnership firms': '5c2ed40c-af81-4691-a36d-67b2be5a51d1',
  'Others': '5edee7df-cd92-4be5-a76c-bac94b1b6963',
  'Academics': '7b3d42bb-3c85-4e8d-a56f-8c871f158bcb',
  'User': '801e4fc0-9ea9-4980-811a-bb799c6da05e',
  'Insolvency Professional Agency': '8c97d42b-32a5-4f01-8a4f-ab0c683dace9',
  'General': 'a54e5246-9cb9-4f85-9f11-d72eef81199a',
  'Insolvency Professional': 'bf2f6dd3-3149-444e-b53d-9e1b346913b4',
  'Proprietorship firms': 'caa98f79-2109-4556-a58e-7e96926c7991',
  'Creditor to a Corporate Debtor': 'ce9b70e4-2e90-4cc5-814c-0a4980517852',
};

async function main() {
  const filePath = path.join(__dirname, '../../ai_models/model1/data/company copy.json');
  const companies = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let inserted = 0;
  let skipped = 0;

  for (const company of companies) {
    const { companyName, state, category } = company;
    // Use default value for uniNumber if missing
    const uniNumber = company.uniNumber ? company.uniNumber : "N/A";
    if (!companyName || !state || !category) {
      console.log(`Skipping incomplete entry: ${JSON.stringify(company)}`);
      skipped++;
      continue;
    }
    const businessCategoryId = categoryMap[category];
    if (!businessCategoryId) {
      console.log(`Unknown category: ${category} for company ${companyName}`);
      skipped++;
      continue;
    }
    // Check for existing company by name
    const exists = await prisma.company.findUnique({ where: { name: companyName } });
    if (exists) {
      console.log(`Company already exists: ${companyName}`);
      skipped++;
      continue;
    }
    try {
      await prisma.company.create({
        data: {
          name: companyName,
          uniNumber,
          state,
          businessCategoryId,
        },
      });
      console.log(`Inserted: ${companyName}`);
      inserted++;
    } catch (err) {
      console.error(`Error inserting ${companyName}:`, err);
      skipped++;
    }
  }
  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
  await prisma.$disconnect();
}

main();
