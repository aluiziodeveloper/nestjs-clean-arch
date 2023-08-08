import { Module } from '@nestjs/common'
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module'
import { UsersModule } from './users/infrastructure/users.module'
import { DatabaseModule } from './shared/infrastructure/database/database.module'

@Module({
  imports: [EnvConfigModule, UsersModule, DatabaseModule],
})
export class AppModule {}
