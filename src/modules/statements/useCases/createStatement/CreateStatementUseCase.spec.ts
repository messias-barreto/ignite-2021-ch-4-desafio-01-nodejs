import { Statement } from './../../entities/Statement';
import { AuthenticateUserUseCase } from './../../../users/useCases/authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { ICreateStatementDTO } from './ICreateStatementDTO';
import { AppError } from '../../../../shared/errors/AppError';

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUsecase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create a New Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository);
    createUserUsecase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
  })

  it("shold be able to create a new Statement", async() => {
    await createUserUsecase.execute({
      name: "Test test",
      email: "Test@test.com",
      password: "123123"
    });

    //Authenticate User
    const auth_user = await authenticateUserUseCase.execute({
      email: "Test@test.com",
      password: "123123"
    });

    const user_id = auth_user.user.id !== undefined ? auth_user.user.id : 'incorrect';

    const statement = await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "add from secundary work"
    })

    expect(statement).toHaveProperty("id");
  })

  it("shold not be able to create a new Statement if user not found", async() => {
    expect(async () => {
      await createUserUsecase.execute({
        name: "Test test",
        email: "Test@test.com",
        password: "123123"
      });

      await createStatementUseCase.execute({
        user_id: 'invalid_id',
        type: OperationType.DEPOSIT,
        amount: 500,
        description: "add from secundary work"
      })
    }).rejects.toBeInstanceOf(AppError);
  });


  it("shold not be able to create a new Statement if funds was Insufficient", async() => {
    expect(async () => {
      await createUserUsecase.execute({
        name: "Test test",
        email: "Test@test.com",
        password: "123123"
      });

      //Authenticate User
      const auth_user = await authenticateUserUseCase.execute({
        email: "Test@test.com",
        password: "123123"
      });

      const user_id = auth_user.user.id !== undefined ? auth_user.user.id : 'incorrect';

      await createStatementUseCase.execute({
        user_id,
        type: OperationType.WITHDRAW,
        amount: 500,
        description: "add from secundary work"
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
