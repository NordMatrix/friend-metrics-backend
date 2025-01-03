import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Friends')
@ApiBearerAuth()
@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiOperation({ summary: 'Create new friend' })
  @ApiBody({ type: CreateFriendDto })
  @ApiResponse({
    status: 201,
    description: 'Friend successfully created',
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        relationshipScore: { type: 'number' },
        notes: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @Post()
  create(@Body() createFriendDto: CreateFriendDto, @CurrentUser() user: User) {
    return this.friendsService.create(createFriendDto, user);
  }

  @ApiOperation({ summary: 'Get all friends' })
  @ApiResponse({
    status: 200,
    description: 'List of friends retrieved successfully',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          relationshipScore: { type: 'number' },
          notes: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.friendsService.findAll(user);
  }

  @ApiOperation({ summary: 'Get friend details' })
  @ApiResponse({
    status: 200,
    description: 'Friend details retrieved successfully',
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        relationshipScore: { type: 'number' },
        notes: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Friend not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.friendsService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update friend information' })
  @ApiBody({ type: UpdateFriendDto })
  @ApiResponse({
    status: 200,
    description: 'Friend updated successfully',
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        relationshipScore: { type: 'number' },
        notes: { type: 'string' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Friend not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFriendDto: UpdateFriendDto,
    @CurrentUser() user: User,
  ) {
    return this.friendsService.update(id, updateFriendDto, user);
  }

  @ApiOperation({ summary: 'Delete friend' })
  @ApiResponse({ status: 200, description: 'Friend deleted successfully' })
  @ApiResponse({ status: 404, description: 'Friend not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.friendsService.remove(id, user);
  }

  @ApiOperation({ summary: 'Update relationship score' })
  @ApiBody({ type: UpdateScoreDto })
  @ApiResponse({
    status: 200,
    description: 'Relationship score updated successfully',
    schema: {
      properties: {
        id: { type: 'string' },
        relationshipScore: { type: 'number' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Friend not found' })
  @Patch(':id/score')
  updateScore(
    @Param('id') id: string,
    @Body() updateScoreDto: UpdateScoreDto,
    @CurrentUser() user: User,
  ) {
    return this.friendsService.updateScore(id, updateScoreDto, user);
  }
}
