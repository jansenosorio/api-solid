import {Prisma, User} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import {UsersRepository} from "@/repositories/users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: data.password_hash,
      },
    });
  }
}
