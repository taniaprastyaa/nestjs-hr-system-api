import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedAdmin() {
  const user = await prisma.user.findFirst({ where: { username: 'admin' } });

  await prisma.admin.create({
    data: {
      name: 'Admin',
      phone: '08568213891',
      user_id: user.id
    },
  });
}

export default seedAdmin;
