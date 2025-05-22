import { PrismaClient } from '@prisma/client'
import seedUser from './user.seeder';
import seedAdmin from './admin.seeder';


const prisma = new PrismaClient()

async function seed() {
  await seedUser()  
  await seedAdmin()  
}

seed()
  .catch((error) => {
    throw error
  })
  .finally(async () => { 
    await prisma.$disconnect()
  })
 