import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isDefault = exception instanceof HttpException;

    const customResponse = exception.getResponse() as any;

    const status = isDefault ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isDefault ? customResponse.message : 'INTERNAL SERVER ERROR';

    const errorResponse = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };
    // TODO: LOGGING

    response.status(status).json(errorResponse);
  }
}
