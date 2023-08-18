import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { WrapperDataInterceptor } from './shared/infrastructure/interceptors/wrapper-data/wrapper-data.interceptor'
import { ConflictErrorFilter } from './shared/infrastructure/exception-filters/conflict-error/conflict-error.filter'
import { NotFoundErrorFilter } from './shared/infrastructure/exception-filters/not-found-error/not-found-error.filter'

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  )
  app.useGlobalFilters(new ConflictErrorFilter(), new NotFoundErrorFilter())
}
