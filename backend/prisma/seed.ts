import { PrismaClient, Role, CubeLevel, CubeStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function requireSeedPassword(envName: string) {
  const value = process.env[envName];
  if (!value) {
    throw new Error(`${envName} must be set before running the seed script.`);
  }
  return value;
}

async function main() {
  console.log('Starting seed...');

  const staffPassword = requireSeedPassword('SEED_STAFF_PASSWORD');
  const cubePassword = requireSeedPassword('SEED_CUBE_PASSWORD');
  const yunusPassword = process.env.SEED_YUNUS_PASSWORD || staffPassword;

  const adminUsers = [
    {
      name: 'Yunus Emre Altanay',
      email: 'yunus.altanay@iceberg-digital.co.uk',
      password: yunusPassword,
    },
    {
      name: 'Mark Burgess',
      email: 'mark@iceberg-digital.co.uk',
      password: staffPassword,
    },
    {
      name: 'Ahmet Onur Solmaz',
      email: 'ahmet.solmaz@iceberg-digital.co.uk',
      password: staffPassword,
    },
    {
      name: 'Barış Babacanoğlu',
      email: 'baris@iceberg-digital.co.uk',
      password: staffPassword,
    },
    {
      name: 'Yusuf Tokgöz',
      email: 'yusuf@iceberg-digital.co.uk',
      password: staffPassword,
    },
  ];

  const mentorUsers = [
    { name: 'Ahmet Onur Başterzi', email: 'onur.basterzi@iceberg-digital.co.uk', password: staffPassword },
    { name: 'Altuğ Ege Sarı', email: 'altug.ege@iceberg-digital.co.uk', password: staffPassword },
    { name: 'Bora Küçükkara', email: 'bora.kucukkara@iceberg-digital.co.uk', password: staffPassword },
    { name: 'Furkan Meraloğlu', email: 'furkan.meraloglu@iceberg-digital.co.uk', password: staffPassword },
  ];

  const icebergFellows = [
    { name: 'Elif Yıldız', email: 'elif.yildiz@iceberg-digital.co.uk' },
    { name: 'İlayda Günay', email: 'ilayda.gunay@iceberg-digital.co.uk' },
    { name: 'Özcan Yıldızhan', email: 'ozcan.yildizhan@iceberg-digital.co.uk' },
    { name: 'Cenk Yalçın', email: 'cenk.yalcin@iceberg-digital.co.uk' },
    { name: 'Batuhan Koç', email: 'batuhan.koc@iceberg-digital.co.uk' },
    { name: 'Doğancan Acar', email: 'dogancan.acar@iceberg-digital.co.uk' },
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

  // 2. Upsert the specified admin users
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

  // Mehmet Bulut was previously added as a mentor; promote the existing record to Admin.
  const mehmetBulut = await prisma.user.findFirst({
    where: { name: 'Mehmet Bulut' },
  });
  if (mehmetBulut) {
    console.log('Promoting Mehmet Bulut to Admin...');
    await prisma.user.update({
      where: { id: mehmetBulut.id },
      data: { role: Role.ADMIN },
    });
  }

  // 3. Upsert mentors
  for (const mentorData of mentorUsers) {
    const passwordHash = await bcrypt.hash(mentorData.password, 10);
    const existingUser = await prisma.user.findUnique({
      where: { email: mentorData.email },
    });

    if (!existingUser) {
      console.log(`Creating Mentor: ${mentorData.name} (${mentorData.email})...`);
      await prisma.user.create({
        data: {
          name: mentorData.name,
          email: mentorData.email,
          password_hash: passwordHash,
          role: Role.MENTOR,
        },
      });
    } else {
      console.log(`Updating existing Mentor credentials: ${mentorData.email}...`);
      await prisma.user.update({
        where: { email: mentorData.email },
        data: {
          name: mentorData.name,
          password_hash: passwordHash,
          role: Role.MENTOR,
        },
      });
    }
  }

  // 4. Seed Cubes (Students)
  const cubeStudents = [
    { name: 'Mesut Umur Tokyürek', email: 'umrtkyrk@gmail.com', internship_status: 'No mandatory internship' },
    { name: 'Barış Tepe', email: 'baristepe04@gmail.com', internship_status: 'Will submit mandatory internship document' },
    { name: 'Süleyman Emre Parlak', email: 'emre-parlak2002@hotmail.com', internship_status: 'No mandatory internship' },
    { name: 'Ozan Uslan', email: 'uslanozan@gmail.com', internship_status: 'No mandatory internship' },
    { name: 'Gözde Kaçar', email: 'kcr.gozde@gmail.com', internship_status: 'No mandatory internship' },
    { name: 'Ayşenur Demezoğlu', email: 'aysenurdemezoglu@gmail.com', internship_status: 'No mandatory internship' },
    { name: 'Zelal Erpay', email: 'zelalerpay06@gmail.com', internship_status: 'No mandatory internship' },
    { name: 'Tarık Deniz', email: 'tarikdeniz2002@gmail.com', internship_status: 'No mandatory internship' },
    { name: 'Emir Bakkal', email: 'ebakkal2@gmail.com', internship_status: 'No mandatory internship' },
    { name: 'Henife Yaylı', email: 'henifeyayli@gmail.com', internship_status: 'Internship document submitted' },
    { name: 'Medine Kaynak', email: 'medinekaynak2906@gmail.com', internship_status: 'Internship document submitted' },
    { name: 'Ali Çağlar Koçer', email: 'alicaglarkocer@gmail.com', internship_status: 'Internship document submitted' },
    { name: 'Doğukan Taha Tıraş', email: 'dogukantt27@gmail.com', internship_status: 'Internship document submitted' },
    { name: 'Enes Yusuf Gökçe', email: 'eyusufgokce@gmail.com', internship_status: 'Internship document submitted' },
    { name: 'Seyfullah Korkmaz', email: 'seyfullahkorkmaz115@gmail.com', internship_status: 'Internship document submitted' }
  ];

  for (const student of cubeStudents) {
    const existingUser = await prisma.user.findUnique({
      where: { email: student.email }
    });

    if (!existingUser) {
      console.log(`Creating Cube User: ${student.name} (${student.email})...`);
      
      // Determine the next cube number dynamically
      const lastProfile = await prisma.cubeProfile.findFirst({
        orderBy: { cube_number: 'desc' }
      });
      let nextNum = 1;
      if (lastProfile) {
        const parsed = parseInt(lastProfile.cube_number, 10);
        if (!isNaN(parsed)) {
          nextNum = parsed + 1;
        }
      }
      const nextCubeNumber = String(nextNum).padStart(3, '0');
      const passwordHash = await bcrypt.hash(cubePassword, 10);

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: student.name,
            email: student.email,
            password_hash: passwordHash,
            role: Role.CUBE
          }
        });

        await tx.cubeProfile.create({
          data: {
            user_id: user.id,
            cube_number: nextCubeNumber,
            cohort: 'Summer 2026',
            university: 'Muğla Sıtkı Koçman Üniversitesi',
            department: '',
            skills: [],
            interests: [],
            current_level: CubeLevel.Cube,
            status: CubeStatus.active,
            internship_status: student.internship_status
          }
        });
      });
    } else {
      console.log(`Cube user already exists: ${student.email}. Updating details if needed.`);
      await prisma.cubeProfile.updateMany({
        where: { user_id: existingUser.id },
        data: {
          internship_status: student.internship_status,
          university: 'Muğla Sıtkı Koçman Üniversitesi'
        }
      });
    }
  }

  // 5. Seed experienced Cubes as Iceberg Fellows / Alumni until a dedicated middle layer exists.
  for (const fellow of icebergFellows) {
    const passwordHash = await bcrypt.hash(cubePassword, 10);
    const existingUser = await prisma.user.findUnique({
      where: { email: fellow.email }
    });

    if (!existingUser) {
      console.log(`Creating Iceberg Fellow: ${fellow.name} (${fellow.email})...`);

      const lastProfile = await prisma.cubeProfile.findFirst({
        orderBy: { cube_number: 'desc' }
      });
      let nextNum = 1;
      if (lastProfile) {
        const parsed = parseInt(lastProfile.cube_number, 10);
        if (!isNaN(parsed)) {
          nextNum = parsed + 1;
        }
      }
      const nextCubeNumber = String(nextNum).padStart(3, '0');

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: fellow.name,
            email: fellow.email,
            password_hash: passwordHash,
            role: Role.CUBE
          }
        });

        await tx.cubeProfile.create({
          data: {
            user_id: user.id,
            cube_number: nextCubeNumber,
            cohort: 'Iceberg Fellows',
            university: '',
            department: '',
            skills: [],
            interests: [],
            current_level: CubeLevel.Iceberg_Fellow,
            status: CubeStatus.alumni,
            internship_status: 'Alumni'
          }
        });
      });
    } else {
      console.log(`Iceberg Fellow already exists: ${fellow.email}. Updating level/status.`);
      await prisma.user.update({
        where: { email: fellow.email },
        data: {
          name: fellow.name,
          password_hash: passwordHash,
          role: Role.CUBE,
        }
      });

      const existingProfile = await prisma.cubeProfile.findUnique({
        where: { user_id: existingUser.id }
      });

      if (existingProfile) {
        await prisma.cubeProfile.update({
          where: { user_id: existingUser.id },
          data: {
            cohort: existingProfile.cohort || 'Iceberg Fellows',
            current_level: CubeLevel.Iceberg_Fellow,
            status: CubeStatus.alumni,
            internship_status: 'Alumni'
          }
        });
      } else {
        const lastProfile = await prisma.cubeProfile.findFirst({
          orderBy: { cube_number: 'desc' }
        });
        let nextNum = 1;
        if (lastProfile) {
          const parsed = parseInt(lastProfile.cube_number, 10);
          if (!isNaN(parsed)) {
            nextNum = parsed + 1;
          }
        }
        const nextCubeNumber = String(nextNum).padStart(3, '0');

        await prisma.cubeProfile.create({
          data: {
            user_id: existingUser.id,
            cube_number: nextCubeNumber,
            cohort: 'Iceberg Fellows',
            university: '',
            department: '',
            skills: [],
            interests: [],
            current_level: CubeLevel.Iceberg_Fellow,
            status: CubeStatus.alumni,
            internship_status: 'Alumni'
          }
        });
      }
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
