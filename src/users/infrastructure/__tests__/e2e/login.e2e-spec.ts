import { UserRepository } from '@/users/domain/repositories/user.repository'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import request from 'supertest'
import { applyGlobalConfig } from '@/global-config'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { SigninDto } from '../../dtos/signin.dto'
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let signinDto: SigninDto
  let hashProvider: HashProvider
  const prismaService = new PrismaClient()

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile()
    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()
    repository = module.get<UserRepository.Repository>('UserRepository')
    hashProvider = new BcryptjsHashProvider()
  })

  beforeEach(async () => {
    signinDto = {
      email: 'a@a.com',
      password: 'TestPassword123',
    }
    await prismaService.user.deleteMany()
  })

  describe('POST /users/login', () => {
    it('should authenticate a user', async () => {
      const passwordHash = await hashProvider.generateHash(signinDto.password)
      const entity = new UserEntity({
        ...UserDataBuilder({}),
        email: signinDto.email,
        password: passwordHash,
      })
      await repository.insert(entity)

      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send(signinDto)
        .expect(200)
      expect(Object.keys(res.body)).toStrictEqual(['accessToken'])
      expect(typeof res.body.accessToken).toEqual('string')
    })

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({})
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'password should not be empty',
        'password must be a string',
      ])
    })

    it('should return a error with 422 code when the email field is invalid', async () => {
      delete signinDto.email
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send(signinDto)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
      ])
    })

    it('should return a error with 422 code when the password field is invalid', async () => {
      delete signinDto.password
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send(signinDto)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
      ])
    })

    it('should return a error with 404 code when email not found', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: 'b@b.com', password: 'fake' })
        .expect(404)
      expect(res.body.error).toBe('Not Found')
      expect(res.body.message).toEqual(
        'UserModel not found using email b@b.com',
      )
    })

    it('should return a error with 400 code when password is incorrect', async () => {
      const passwordHash = await hashProvider.generateHash(signinDto.password)
      const entity = new UserEntity({
        ...UserDataBuilder({}),
        email: signinDto.email,
        password: passwordHash,
      })
      await repository.insert(entity)

      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: signinDto.email, password: 'fake' })
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid credentials',
        })
    })
  })
})
