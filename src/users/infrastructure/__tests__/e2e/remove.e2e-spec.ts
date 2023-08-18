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

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
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
    await prismaService.user.deleteMany()
    entity = new UserEntity(UserDataBuilder({}))
    await repository.insert(entity)
  })

  describe('DELETE /users/:id', () => {
    it('should remove a user', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/users/${entity._id}`)
        .expect(204)
        .expect({})
    })

    it('should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .delete('/users/fakeId')
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'UserModel not found using ID fakeId',
        })
    })
  })
})
