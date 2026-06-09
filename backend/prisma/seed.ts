import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const adminUsers = [
    {
      name: 'Yunus Emre Altanay',
      email: 'yunus.altanay@iceberg-digital.co.uk',
      password: 'paswd3102005',
    },
    {
      name: 'Mark Burgess',
      email: 'mark@iceberg-digital.co.uk',
      password: 'paswd1234567',
    },
    {
      name: 'Ahmet Onur Solmaz',
      email: 'ahmet.solmaz@iceberg-digital.co.uk',
      password: 'paswd1234567',
    },
    {
      name: 'Barış Babacanoğlu',
      email: 'baris@iceberg-digital.co.uk',
      password: 'paswd1234567',
    },
  ];

  // 1. Clean up the old default seed admin if it exists
  const oldAdmin = await prisma.user.findUnique({
    where: { email: 'admin@iceberg.com' },
  });
  if (oldAdmin) {
    console.log('Removing old default admin account...');
    // Delete any relations first if necessary, but since it's just seeded, deleteMany is safe.
    await prisma.user.delete({ where: { email: 'admin@iceberg.com' } });
  }

  // 2. Upsert the 4 specified admin users
  for (const adminData of adminUsers) {
    const passwordHash = await bcrypt.hash(adminData.password, 10);
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (!existingUser) {
      console.log(`Creating Admin: ${adminData.name} (${adminData.email})...`);
      await prisma.user.create({
        data: {
          name: adminData.name,
          email: adminData.email,
          password_hash: passwordHash,
          role: Role.ADMIN,
        },
      });
    } else {
      console.log(`Updating existing Admin credentials: ${adminData.email}...`);
      await prisma.user.update({
        where: { email: adminData.email },
        data: {
          name: adminData.name,
          password_hash: passwordHash,
          role: Role.ADMIN,
        },
      });
    }
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
