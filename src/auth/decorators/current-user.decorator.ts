import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUser = (data: unknown, ctx: ExecutionContext) => {
  const http = ctx.switchToHttp();
  if (!http) return undefined;
  const request = http.getRequest();
  return request?.user;
};

export const CurrentUser = createParamDecorator(getCurrentUser); 