import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, map } from 'rxjs'

@Injectable()
export class WrapperDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(body => {
        console.log('Intercepted ', body)
        return body
      }),
    )
  }
}
