import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Marketplace...');

  // Create Categories
  const catMode = await prisma.category.create({
    data: { name: 'Mode' },
  });
  
  const catElectro = await prisma.category.create({
    data: { name: 'Électronique' },
  });

  const catAlimentaire = await prisma.category.create({
    data: { name: 'Alimentaire' },
  });

  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'seller@zenda.tg',
        passwordHash: 'dummy_hash',
      }
    });
  }

  const sellerId = user.id;

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        sellerId,
        categoryId: catMode.id,
        title: 'T-shirt Zenda Noir',
        description: 'T-shirt en coton bio avec le logo Zenda.',
        price: 5000,
        stock: 50,
        condition: 'NEW',
        images: ['https://placehold.co/400x400/111111/FFFFFF/png?text=T-shirt+Zenda'],
      },
      {
        sellerId,
        categoryId: catElectro.id,
        title: 'Smartphone X Pro',
        description: 'Smartphone dernière génération 128Go.',
        price: 150000,
        stock: 10,
        condition: 'USED_LIKE_NEW',
        images: ['https://placehold.co/400x400/333333/FFFFFF/png?text=Smartphone'],
      },
      {
        sellerId,
        categoryId: catAlimentaire.id,
        title: 'Sac de Riz 25kg',
        description: 'Riz parfumé de première qualité.',
        price: 22000,
        stock: 100,
        condition: 'NEW',
        images: ['https://placehold.co/400x400/222222/FFFFFF/png?text=Riz+25kg'],
      }
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
