import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from './../../../users/useCases/authenticateUser/AuthenticateUserUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUserRepository
    );
  })

  it("shold be able to list all user's balance", async() => {
    //Create a new User
    await createUserUseCase.execute({
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
    //get balance user
    await getBalanceUseCase.execute({ user_id })
  })
})
