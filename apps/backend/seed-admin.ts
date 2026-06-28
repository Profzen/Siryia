import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
const prisma = new PrismaClient();
async function main() {
  const email = "admin@siryia.com";
  const password = "admin";
  let adminRole = await prisma.role.findUnique({ where: { id: "ADMIN" } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { id: "ADMIN", description: "Administrateur principal" } });
  }
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const hashedPassword = await argon2.hash(password);
    user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        profile: {
          create: {
            firstName: "Super",
            lastName: "Admin",
            kycStatus: "VERIFIED",
          }
        },
      }
    });
    console.log("Created user:", email);
  } else {
    console.log("User already exists:", email);
  }
  const userRole = await prisma.userRole.findUnique({
    where: { userId_roleId: { userId: user.id, roleId: "ADMIN" } }
  });
  if (!userRole) {
    await prisma.userRole.create({
      data: { userId: user.id, roleId: "ADMIN" }
    });
    console.log("Assigned ADMIN role to:", email);
  } else {
    console.log("User already has ADMIN role");
  }
  console.log("Done!");
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
