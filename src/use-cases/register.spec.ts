import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register use case", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
    });

    const isPasswordHashValid = await compare(
      "securepassword",
      user.password_hash
    );

    expect(isPasswordHashValid).toBe(true);
  });

  it("should not able to register with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "john.doe@example.com";

    await registerUseCase.execute({
      name: "John Doe",
      email,
      password: "securepassword",
    });

    await expect(async () => {
      await registerUseCase.execute({
        name: "John Doe",
        email,
        password: "securepassword",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
