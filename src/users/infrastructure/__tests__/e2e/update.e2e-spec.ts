import { UserRepository } from '@/users/domain/repositories/user.repository'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import request from 'supertest'
import { UsersController } from '../../users.controller'
import { instanceToPlain } from 'class-transformer'
import { applyGlobalConfig } from '@/global-config'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdateUserDto } from '../../dtos/update-user.dto'

describe('UsersController unit tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let updateUserDto: UpdateUserDto
  const prismaService = new PrismaClient()
  let entity: UserEntity

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
  })

  beforeEach(async () => {
    updateUserDto = {
      name: 'test name',
    }
    await prismaService.user.deleteMany()
    entity = new UserEntity(UserDataBuilder({}))
    await repository.insert(entity)
  })

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      updateUserDto.name = 'test name'
      const res = await request(app.getHttpServer())
        .put(`/users/${entity._id}`)
        .send(updateUserDto)
        .expect(200)
      const user = await repository.findById(entity._id)
      const presenter = UsersController.userToResponse(user.toJSON())
      const serialized = instanceToPlain(presenter)
      expect(res.body.data).toStrictEqual(serialized)
    })

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${entity._id}`)
        .send({})
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ])
    })

    // it('should return a error with 422 code when the name field is invalid', async () => {
    //   delete signupDto.name
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signupDto)
    //     .expect(422)
    //   expect(res.body.error).toBe('Unprocessable Entity')
    //   expect(res.body.message).toEqual([
    //     'name should not be empty',
    //     'name must be a string',
    //   ])
    // })

    // it('should return a error with 422 code when the email field is invalid', async () => {
    //   delete signupDto.email
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signupDto)
    //     .expect(422)
    //   expect(res.body.error).toBe('Unprocessable Entity')
    //   expect(res.body.message).toEqual([
    //     'email must be an email',
    //     'email should not be empty',
    //     'email must be a string',
    //   ])
    // })

    // it('should return a error with 422 code when the password field is invalid', async () => {
    //   delete signupDto.password
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signupDto)
    //     .expect(422)
    //   expect(res.body.error).toBe('Unprocessable Entity')
    //   expect(res.body.message).toEqual([
    //     'password should not be empty',
    //     'password must be a string',
    //   ])
    // })

    // it('should return a error with 422 code with invalid field provided', async () => {
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(Object.assign(signupDto, { xpto: 'fake' }))
    //     .expect(422)
    //   expect(res.body.error).toBe('Unprocessable Entity')
    //   expect(res.body.message).toEqual(['property xpto should not exist'])
    // })

    // it('should return a error with 409 code when the email is duplicated', async () => {
    //   const entity = new UserEntity(UserDataBuilder({ ...signupDto }))
    //   await repository.insert(entity)
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signupDto)
    //     .expect(409)
    //     .expect({
    //       statusCode: 409,
    //       error: 'Conflict',
    //       message: 'Email address already used',
    //     })
    // })
  })
})
