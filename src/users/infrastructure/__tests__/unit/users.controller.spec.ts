import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dtos/user-output'
import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { SignupDto } from '../../dtos/signup.dto'
import { SigninUseCase } from '@/users/application/usecases/signin.usecase'
import { SigninDto } from '../../dtos/signin.dto'
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase'
import { UpdatePasswordDto } from '../../dtos/update-password.dto'
import { GetUserUseCase } from '@/users/application/usecases/getuser.usecase'
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase'
import {
  UserCollectionPresenter,
  UserPresenter,
} from '../../presenters/user.presenter'

describe('UsersController unit tests', () => {
  let sut: UsersController
  let id: string
  let props: UserOutput

  beforeEach(async () => {
    sut = new UsersController()
    id = 'df96ae94-6128-486e-840c-b6f78abb4801'
    props = {
      id,
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
      createdAt: new Date(),
    }
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should create a user', async () => {
    const output: SignupUseCase.Output = props
    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['signupUseCase'] = mockSignupUseCase as any
    const input: SignupDto = {
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
    }
    const presenter = await sut.create(input)
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should authenticate a user', async () => {
    const output = 'fake_token'
    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    const mockAuthService = {
      generateJwt: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['signinUseCase'] = mockSigninUseCase as any
    sut['authService'] = mockAuthService as any
    const input: SigninDto = {
      email: 'a@a.com',
      password: '1234',
    }
    const result = await sut.login(input)
    expect(result).toEqual(output)
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should update a user', async () => {
    const output: UpdateUserUseCase.Output = props
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['updateUserUseCase'] = mockUpdateUserUseCase as any
    const input: UpdateUserDto = {
      name: 'new name',
    }
    const presenter = await sut.update(id, input)
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({ id, ...input })
  })

  it('should update a users password', async () => {
    const output: UpdatePasswordUseCase.Output = props
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any
    const input: UpdatePasswordDto = {
      password: 'new password',
      oldPassword: 'old password',
    }
    const presenter = await sut.updatePassword(id, input)
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    })
  })

  it('should delete a user', async () => {
    const output = undefined
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any
    const result = await sut.remove(id)
    expect(output).toStrictEqual(result)
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })

  it('should gets a user', async () => {
    const output: GetUserUseCase.Output = props
    const mockGetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['getUserUseCase'] = mockGetUserUseCase as any
    const presenter = await sut.findOne(id)
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })

  it('should list users', async () => {
    const output: ListUsersUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    }
    const mockListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['listUsersUseCase'] = mockListUsersUseCase as any
    const searchParams = {
      page: 1,
      perPage: 1,
    }
    const presenter = await sut.search(searchParams)
    expect(presenter).toBeInstanceOf(UserCollectionPresenter)
    expect(presenter).toEqual(new UserCollectionPresenter(output))
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(searchParams)
  })
})
