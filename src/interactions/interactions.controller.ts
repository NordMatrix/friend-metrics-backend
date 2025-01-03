import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Interactions')
@ApiBearerAuth()
@Controller('friends/:friendId/interactions')
@UseGuards(JwtAuthGuard)
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @ApiOperation({ summary: 'Create new interaction' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  @ApiBody({ type: CreateInteractionDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Interaction created successfully',
    schema: {
      properties: {
        id: { type: 'string' },
        type: { type: 'string' },
        scoreChange: { type: 'number' },
        friend: { 
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Friend not found' })
  @Post()
  create(
    @Param('friendId') friendId: string,
    @Body() createInteractionDto: CreateInteractionDto,
    @CurrentUser() user: User,
  ) {
    return this.interactionsService.create(friendId, createInteractionDto, user);
  }

  @ApiOperation({ summary: 'Get all interactions with friend' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of interactions retrieved successfully',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          scoreChange: { type: 'number' },
          friend: { 
            type: 'object',
            properties: {
              id: { type: 'string' }
            }
          },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Friend not found' })
  @Get()
  findAll(@Param('friendId') friendId: string, @CurrentUser() user: User) {
    return this.interactionsService.findAll(friendId, user);
  }

  @ApiOperation({ summary: 'Get interaction statistics' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Statistics retrieved successfully',
    schema: {
      properties: {
        total: { type: 'number', description: 'Total number of interactions' },
        byType: { 
          type: 'object',
          description: 'Number of interactions by type',
          additionalProperties: { type: 'number' }
        },
        byMonth: {
          type: 'object',
          description: 'Number of interactions by month (YYYY-MM format)',
          additionalProperties: { type: 'number' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Friend not found' })
  @Get('statistics')
  getStatistics(@Param('friendId') friendId: string, @CurrentUser() user: User) {
    return this.interactionsService.getStatistics(friendId, user);
  }

  @ApiOperation({ summary: 'Get specific interaction' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  @ApiParam({ name: 'id', description: 'Interaction ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Interaction retrieved successfully',
    schema: {
      properties: {
        id: { type: 'string' },
        type: { type: 'string' },
        scoreChange: { type: 'number' },
        friend: { 
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Interaction or friend not found' })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Param('friendId') friendId: string,
    @CurrentUser() user: User,
  ) {
    return this.interactionsService.findOne(id, friendId, user);
  }

  @ApiOperation({ summary: 'Delete interaction' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  @ApiParam({ name: 'id', description: 'Interaction ID' })
  @ApiResponse({ status: 200, description: 'Interaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Interaction or friend not found' })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Param('friendId') friendId: string,
    @CurrentUser() user: User,
  ) {
    return this.interactionsService.remove(id, friendId, user);
  }
} 