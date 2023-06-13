import { Module } from '@nestjs/common'
import { EnvConfigService } from './env-config.service'

@Module({
  providers: [EnvConfigService],
})
export class EnvConfigModule {}
