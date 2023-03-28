import { CreateStatementUseCase } from './../createStatement/CreateStatementUseCase';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './../../../users/useCases/authenticateUser/AuthenticateUserUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';



let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe("List Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );
  })


  it("shold be able to withdraw a user statement", async () => {
    //CREATE A NEW USER
    await createUserUseCase.execute({
      name: "Test test",
      email: "Test@test.com",
      password: "123123"
    });


    //AUTHENTICATE A USER
    const auth_user = await authenticateUserUseCase.execute({
      email: "Test@test.com",
      password: "123123"
    });

    const user_id = auth_user.user.id !== undefined ? auth_user.user.id : 'incorrect';

    //CREATE A NEW STATEMENT
    const statement = await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "add from secundary work"
    })

    const statement_id = statement.id !== undefined ? statement.id : 'incorrect';

    await getStatementOperationUseCase.execute({
      user_id,
      statement_id
    })
  })
})
