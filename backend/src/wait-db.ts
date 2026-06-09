import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  let retries = 15;
  console.log('Verifying database availability...');
  
  while (retries > 0) {
    try {
      await prisma.$connect();
      console.log('Database connection established successfully.');
      await prisma.$disconnect();
      process.exit(0);
    } catch (err: any) {
      console.log(`Database not ready yet: ${err.message}. Retrying in 2 seconds... (${retries} retries left)`);
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  
  console.error('Failed to connect to the database. Exiting.');
  process.exit(1);
}

main().catch((err) => {
  console.error('Wait DB script encountered an error:', err);
  process.exit(1);
});
