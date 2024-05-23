import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || null,
    });
  }
}
