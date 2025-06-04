import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Logger } from 'nestjs-pino';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(Logger)
    private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const logContext = {
      operation: 'http.request',
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      ip: request.ip || request.connection.remoteAddress,
      traceId: request.headers['x-trace-id'] || request.id,
    };

    this.logger.log(logContext, `${request.method} ${request.url} - Iniciado`);

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        
        this.logger.log({
          ...logContext,
          statusCode: response.statusCode,
          duration,
          responseSize: JSON.stringify(data || {}).length,
        }, `${request.method} ${request.url} - Concluído`);
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        
        this.logger.error({
          ...logContext,
          statusCode: error.status || 500,
          duration,
          error: {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          },
        }, `${request.method} ${request.url} - Erro`);

        throw error;
      }),
    );
  }
} 