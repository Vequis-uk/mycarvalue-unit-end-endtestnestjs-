import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {}
}

export function Serialise(dto: any) {
  return UseInterceptors(new SerialiseInterceptor(dto));
}

export class SerialiseInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Run Something Before A Request Is Handled By The Request Handler
    console.log('I Am Running Before The Handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        //Run Something Before The Response Is Sent Out
        console.log('I Am Running Before The Response Is Sent', data);
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
