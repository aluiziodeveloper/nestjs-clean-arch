import { Test, TestingModule } from '@nestjs/testing'
import { EnvConfigService } from '../../env-config.service'
import { EnvConfigModule } from '../../env-config.module'

describe('EnvConfigService unit tests', () => {
  let sut: EnvConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService],
    }).compile()

    sut = module.get<EnvConfigService>(EnvConfigService)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should return the variable PORT', () => {
    expect(sut.getAppPort()).toBe(3000)
  })

  it('should return the variable NODE_ENV', () => {
    expect(sut.getNodeEnv()).toBe('test')
  })

  it('should return the variable JWT_SECRET', () => {
    expect(sut.getJwtSecret()).toBe('fake_secret')
  })

  it('should return the variable JWT_EXPIRES_IN', () => {
    expect(sut.getJwtExpiresInSeconds()).toBe(86400)
  })
})
