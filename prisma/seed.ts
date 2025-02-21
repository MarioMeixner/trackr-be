import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  const mario = await prisma.user.upsert({
    where: { email: 'mario@trackr.io' },
    update: {},
    create: {
      email: 'mario@trackr.io',
      name: 'Mario Meixner',
      password: hashedPassword,
      tracks: {
        create: {
          title: 'Check out Prisma with Next.js',
          duration: '45m',
        },
      },
    },
  });
  const track = await prisma.track.create({
    data: {
      title: 'Track your time',
      duration: '1h0m',
      author: {
        connectOrCreate: {
          where: {
            email: 'mario@trackr.io',
          },
          create: {
            email: 'mario@trackr.io',
            password: hashedPassword,
          },
        },
      },
    },
  });
  console.log({ mario, track });
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
