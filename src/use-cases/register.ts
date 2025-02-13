import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";
import { PrismaUsersRepository } from "../repositories/prisma-users-repository";

interface RegisterUseCaseParams {
  name: string;
  email: string;
  password: string;
}

export async function RegisterUseCase({
  name,
  email,
  password,
}: RegisterUseCaseParams) {
  const password_hash = await hash(password, 6);

  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) {
    throw new Error("Email is already in use.");
  }

  const prismaUsersRepository = new PrismaUsersRepository();

  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  });
}
