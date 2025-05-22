import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2'

const prisma = new PrismaClient();

async function seedUser() {  
  const hashedPassword = await argon.hash('super-secret');

  await prisma.user.create({
    data: {
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,  
        role: 'Admin',
    },
  });

}

export default seedUser;