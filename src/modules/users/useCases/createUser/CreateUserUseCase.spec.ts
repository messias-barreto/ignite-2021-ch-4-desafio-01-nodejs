import { CreateUserUseCase } from './CreateUserUseCase';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { hash } from 'bcryptjs';
import { AppError } from '../../../../shared/errors/AppError';

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a new User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("Should be able to create a new user", async() => {

    const password = await hash("123123", 8);

    const user = await createUserUseCase.execute({
      name: "Test test",
      email: "Test@test.com",
      password: password
    });

    const find_user = await usersRepositoryInMemory.findByEmail(user.email)
    expect(find_user).toHaveProperty("id");
  })

  it("Should not be able to create a new user if email already registed", async() => {
    expect(async() => {

      const password = await hash("123123", 8);

      await createUserUseCase.execute({
        name: "Test test",
        email: "Test@test.com",
        password: password
      });

      await createUserUseCase.execute({
        name: "Test test",
        email: "Test@test.com",
        password: password
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
