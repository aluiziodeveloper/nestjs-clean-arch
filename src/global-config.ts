import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { WrapperDataInterceptor } from './shared/infrastructure/interceptors/wrapper-data/wrapper-data.interceptor'

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  )
}
