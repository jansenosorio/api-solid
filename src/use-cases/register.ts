import { hash } from "bcryptjs";
import {UsersRepository} from "@/repositories/users-repository";

interface RegisterUseCaseParams {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) {
  }

  async execute({ name, email, password }: RegisterUseCaseParams) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.userRepository.findUserByEmail(email);

    if (userWithSameEmail) {
      throw new Error('E-mail already exists.')
    }

    await this.userRepository.create({
      name,
      email,
      password_hash,
    });
  }
}

