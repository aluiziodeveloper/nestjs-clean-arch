import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ClassSerializerInterceptor } from '@nestjs/common'
import { applyGlobalConfig } from './global-config'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  applyGlobalConfig(app)
  await app.listen(3000, '0.0.0.0')
}
bootstrap()
