import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // Check if admin user already exists in the database
  const existingAdmin = await prisma.user.findFirst({
    where: { role: Role.ADMIN },
  });

  if (!existingAdmin) {
    console.log('No Admin found. Creating default admin...');
    await prisma.user.create({
      data: {
        name: 'Sarah Jenkins',
        email: 'admin@iceberg.com',
        password_hash: passwordHash,
        role: Role.ADMIN,
      },
    });
    console.log('Default admin created successfully.');
  } else {
    console.log('Admin user already exists. Skipping default admin creation.');
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
