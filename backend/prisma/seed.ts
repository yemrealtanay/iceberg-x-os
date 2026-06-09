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

function cubeNumber(num: number) {
  return String(num).padStart(3, '0');
}

async function getNextCubeNumber(tx: PrismaClient | Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) {
  const lastProfile = await tx.cubeProfile.findFirst({
    orderBy: { cube_number: 'desc' }
  });
  let nextNum = 1;
  if (lastProfile) {
    const parsed = parseInt(lastProfile.cube_number, 10);
    if (!isNaN(parsed)) {
      nextNum = parsed + 1;
    }
  }
  return cubeNumber(nextNum);
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
    { name: 'Ali Cebeci', email: 'ali.cebeci@iceberg-digital.co.uk', password: staffPassword },
    { name: 'Seyfullah Bozkurt', email: 'seyfullah.bozkurt@iceberg-digital.co.uk', password: staffPassword },
    { name: 'Damla Akkuş', email: 'damla.akkus@iceberg-digital.co.uk', password: staffPassword },
    { name: 'Eren Aygün', email: 'eren.aygun@iceberg-digital.co.uk', password: staffPassword },
    { name: 'Oğuzhan Esin', email: 'oguzhan.esin@iceberg-digital.co.uk', password: staffPassword },
    { name: 'Gülcan Aydoğan', email: 'gulcan.aydogan@iceberg-digital.co.uk', password: staffPassword },
  ];

  const icebergFellows = [
    { name: 'Elif Yıldız', email: 'elif.yildiz@iceberg-digital.co.uk', cube_number: '001' },
    { name: 'İlayda Günay', email: 'ilayda.gunay@iceberg-digital.co.uk', cube_number: '002' },
    { name: 'Özcan Yıldızhan', email: 'ozcan.yildizhan@iceberg-digital.co.uk', cube_number: '003' },
    { name: 'Cenk Yalçın', email: 'cenk.yalcin@iceberg-digital.co.uk', cube_number: '004' },
    { name: 'Batuhan Koç', email: 'batuhan.koc@iceberg-digital.co.uk', cube_number: '005' },
    { name: 'Doğancan Acar', email: 'dogancan.acar@iceberg-digital.co.uk', cube_number: '006' },
  ];

  const badgeDefinitions = [
    { name: 'Builder', description: 'Awarded for consistently turning ideas into working outputs.', icon: 'Builder' },
    { name: 'Innovator', description: 'Awarded for original thinking and novel solution ideas.', icon: 'Innovator' },
    { name: 'Collaborator', description: 'Awarded for strong teamwork and constructive contribution.', icon: 'Collaborator' },
    { name: 'Pathfinder', description: 'Awarded for finding a practical route through ambiguity.', icon: 'Pathfinder' },
    { name: 'Pioneer', description: 'Awarded for work that opens a new direction for the programme.', icon: 'Pioneer' },

    { name: 'Researcher', description: 'Awarded for strong research discipline and useful findings.', icon: 'Researcher' },
    { name: 'Deep Diver', description: 'Awarded for going beyond surface-level investigation.', icon: 'DeepDiver' },
    { name: 'Tech Scout', description: 'Awarded for identifying promising technologies, tools, or patterns.', icon: 'TechScout' },
    { name: 'Clarity Maker', description: 'Awarded for making complex findings easy to understand.', icon: 'ClarityMaker' },
    { name: 'Risk Spotter', description: 'Awarded for identifying risks early and clearly.', icon: 'RiskSpotter' },

    { name: 'Demo Maker', description: 'Awarded for creating a clear and usable demo experience.', icon: 'DemoMaker' },
    { name: 'POC Finisher', description: 'Awarded for bringing a proof of concept to completion.', icon: 'POCFinisher' },
    { name: 'Show, Don’t Tell', description: 'Awarded for demonstrating progress through working evidence.', icon: 'ShowDontTell' },
    { name: 'Prototype Polisher', description: 'Awarded for improving prototype quality and presentation.', icon: 'PrototypePolisher' },
    { name: 'From Idea to Screen', description: 'Awarded for translating an idea into a visible product experience.', icon: 'FromIdeaToScreen' },

    { name: 'Clear Communicator', description: 'Awarded for clear written and verbal communication.', icon: 'ClearCommunicator' },
    { name: 'Daily Signal', description: 'Awarded for consistent and useful daily progress updates.', icon: 'DailySignal' },
    { name: 'No Ghosting', description: 'Awarded for staying responsive and visible during a mission.', icon: 'NoGhosting' },
    { name: 'Early Warner', description: 'Awarded for raising blockers and risks early.', icon: 'EarlyWarner' },
    { name: 'Feedback Receiver', description: 'Awarded for receiving feedback well and acting on it.', icon: 'FeedbackReceiver' },

    { name: 'Self-Aware Cube', description: 'Awarded for honest reflection and self-awareness.', icon: 'SelfAwareCube' },
    { name: 'No Excuses', description: 'Awarded for taking responsibility without deflection.', icon: 'NoExcuses' },
    { name: 'Better Next Time', description: 'Awarded for turning lessons into concrete improvements.', icon: 'BetterNextTime' },
    { name: 'Growth Mindset', description: 'Awarded for visible learning, adaptation, and resilience.', icon: 'GrowthMindset' },
    { name: 'Own Your Work', description: 'Awarded for taking ownership of outputs and outcomes.', icon: 'OwnYourWork' },

    { name: 'Mission Lead', description: 'Awarded for leading a mission with accountability.', icon: 'MissionLead' },
    { name: 'Team Organizer', description: 'Awarded for coordinating people, tasks, and rhythm.', icon: 'TeamOrganizer' },
    { name: 'Initiative Taker', description: 'Awarded for proactively moving work forward.', icon: 'InitiativeTaker' },
    { name: 'Mentor Mindset', description: 'Awarded for helping others learn and progress.', icon: 'MentorMindset' },
    { name: 'Future Lead', description: 'Awarded for showing leadership potential.', icon: 'FutureLead' },
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
      console.log(`Updating existing Admin data: ${adminData.email}...`);
      await prisma.user.update({
        where: { email: adminData.email },
        data: {
          name: adminData.name,
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
      console.log(`Updating existing Mentor data: ${mentorData.email}...`);
      await prisma.user.update({
        where: { email: mentorData.email },
        data: {
          name: mentorData.name,
          role: Role.MENTOR,
        },
      });
    }
  }

  // 4. Seed experienced Cubes first. They are the original Cubes and keep #001-#006.
  const fellowEmails = icebergFellows.map(fellow => fellow.email);
  await prisma.$transaction(async (tx) => {
    const reservedNumbers = icebergFellows.map(fellow => fellow.cube_number);
    const displacedProfiles = await tx.cubeProfile.findMany({
      where: {
        cube_number: { in: reservedNumbers },
        user: { email: { notIn: fellowEmails } }
      },
      include: { user: true },
      orderBy: { cube_number: 'asc' }
    });

    for (const profile of displacedProfiles) {
      await tx.cubeProfile.update({
        where: { id: profile.id },
        data: { cube_number: `TEMP-${profile.id}` }
      });
    }

    for (const fellow of icebergFellows) {
      const passwordHash = await bcrypt.hash(cubePassword, 10);
      const existingUser = await tx.user.findUnique({
        where: { email: fellow.email }
      });

      if (!existingUser) {
        console.log(`Creating Iceberg Fellow: ${fellow.name} (${fellow.email}) as Cube #${fellow.cube_number}...`);
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
            cube_number: fellow.cube_number,
            cohort: 'Iceberg Fellows',
            university: '',
            department: '',
            skills: [],
            interests: [],
            current_level: CubeLevel.Iceberg_Fellow,
            status: CubeStatus.alumni,
            internship_status: 'Alumni',
            is_founding_cube: true
          }
        });
      } else {
        console.log(`Updating Iceberg Fellow: ${fellow.email} as Cube #${fellow.cube_number}.`);
        await tx.user.update({
          where: { email: fellow.email },
          data: {
            name: fellow.name,
            role: Role.CUBE,
          }
        });

        const existingProfile = await tx.cubeProfile.findUnique({
          where: { user_id: existingUser.id }
        });

        if (existingProfile) {
          await tx.cubeProfile.update({
            where: { user_id: existingUser.id },
            data: {
              cube_number: fellow.cube_number,
              cohort: existingProfile.cohort || 'Iceberg Fellows',
              current_level: CubeLevel.Iceberg_Fellow,
              status: CubeStatus.alumni,
              internship_status: 'Alumni',
              is_founding_cube: true
            }
          });
        } else {
          await tx.cubeProfile.create({
            data: {
              user_id: existingUser.id,
              cube_number: fellow.cube_number,
              cohort: 'Iceberg Fellows',
              university: '',
              department: '',
              skills: [],
              interests: [],
              current_level: CubeLevel.Iceberg_Fellow,
              status: CubeStatus.alumni,
              internship_status: 'Alumni',
              is_founding_cube: true
            }
          });
        }
      }
    }

    const usedProfiles = await tx.cubeProfile.findMany({
      select: { cube_number: true }
    });
    const usedNumbers = new Set(
      usedProfiles
        .map(profile => profile.cube_number)
        .filter(number => !number.startsWith('TEMP-'))
    );
    let nextNum = 1;

    for (const profile of displacedProfiles) {
      let nextCubeNumber = cubeNumber(nextNum);
      while (usedNumbers.has(nextCubeNumber)) {
        nextNum += 1;
        nextCubeNumber = cubeNumber(nextNum);
      }

      console.log(`Reassigning existing Cube ${profile.user.email} to Cube #${nextCubeNumber}.`);
      await tx.cubeProfile.update({
        where: { id: profile.id },
        data: { cube_number: nextCubeNumber }
      });
      usedNumbers.add(nextCubeNumber);
      nextNum += 1;
    }
  });

  // 5. Seed Cubes (Students)
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
      const nextCubeNumber = await getNextCubeNumber(prisma);
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
            internship_status: student.internship_status,
            is_founding_cube: true
          }
        });
      });
    } else {
      console.log(`Cube user already exists: ${student.email}. Updating details if needed.`);
      await prisma.cubeProfile.updateMany({
        where: { user_id: existingUser.id },
        data: {
          internship_status: student.internship_status,
          university: 'Muğla Sıtkı Koçman Üniversitesi',
          is_founding_cube: true
        }
      });
    }
  }

  // 6. Seed badge definitions only. Awards are intentionally not created here.
  for (const badge of badgeDefinitions) {
    console.log(`Upserting Badge: ${badge.name}...`);
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {
        description: badge.description,
        icon: badge.icon,
      },
      create: badge,
    });
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
