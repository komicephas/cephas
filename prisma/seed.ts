import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      fullName: "Admin",
      role: UserRole.ADMIN
    }
  });

  const products = [
    {
      name: "Starter Plan",
      slug: "starter-plan",
      description: "Plan de base",
      priceCents: 1900
    },
    {
      name: "Pro Plan",
      slug: "pro-plan",
      description: "Plan pro",
      priceCents: 4900
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        active: true
      },
      create: product
    });
  }

  console.log(`Seed complete. Admin: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
