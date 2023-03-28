import { ICreateUserDTO } from './../createUser/ICreateUserDTO';
import { CreateUserUseCase } from './../createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { AppError } from '../../../../shared/errors/AppError';

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to authenticate a user", async() => {
    const user: ICreateUserDTO = {
        name: "Test test",
        email: "Test@test.com",
        password: "123123"
    }

    await createUserUseCase.execute(user);
    await authenticateUserUseCase.execute({
      email: user.email,
      password: "123123"
    })
  })

  it("Should not be able to authenticate with incorrect password", async() => {
    expect(async () => {
      const user: ICreateUserDTO = {
          name: "Test test",
          email: "Test@test.com",
          password: "password"
      }

      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword"
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
