import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'API is working correctly',
    schema: {
      type: 'string',
      example: 'Hello World!'
    }
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
