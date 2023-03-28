import { AuthenticateUserUseCase } from './../authenticateUser/AuthenticateUserUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { hash } from 'bcryptjs';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Show User's Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("shold be able to list the profile user's information", async() => {
    const user = await createUserUseCase.execute({
      name: "Test test",
      email: "Test@test.com",
      password: "123123"
    });

    const auth_user = await authenticateUserUseCase.execute({
    email: "Test@test.com",
      password: "123123"
    });

    const user_id = auth_user.user.id !== undefined ? auth_user.user.id : 'incorrect';
    const find_user = await showUserProfileUseCase.execute(user_id);

    expect(find_user).toEqual(user);
  })

})
