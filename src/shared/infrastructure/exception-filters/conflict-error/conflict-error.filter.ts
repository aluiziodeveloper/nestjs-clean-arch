import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch()
export class ConflictErrorFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
