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
import { PersonalityService } from './personality.service';
import { CreatePersonalityDto } from './dto/create-personality.dto';
import { UpdatePersonalityDto } from './dto/update-personality.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Personality')
@ApiBearerAuth()
@Controller('friends/:friendId/personality')
@UseGuards(JwtAuthGuard)
export class PersonalityController {
  constructor(private readonly personalityService: PersonalityService) {}

  @ApiOperation({ summary: 'Create personality profile' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  @ApiBody({ type: CreatePersonalityDto })
  @ApiResponse({
    status: 201,
    description: 'Personality profile created successfully',
    schema: {
      properties: {
        id: { type: 'string' },
        extroversionIntroversion: { type: 'number' },
        sensingIntuition: { type: 'number' },
        thinkingFeeling: { type: 'number' },
        judgingPerceiving: { type: 'number' },
        openness: { type: 'number' },
        conscientiousness: { type: 'number' },
        extraversion: { type: 'number' },
        agreeableness: { type: 'number' },
        neuroticism: { type: 'number' },
        friend: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Friend not found' })
  @ApiResponse({
    status: 409,
    description: 'Personality profile already exists',
  })
  @Post()
  create(
    @Param('friendId') friendId: string,
    @Body() createPersonalityDto: CreatePersonalityDto,
    @CurrentUser() user: User,
  ) {
    return this.personalityService.create(friendId, createPersonalityDto, user);
  }

  @ApiOperation({ summary: 'Get personality profile' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  @ApiResponse({
    status: 200,
    description: 'Personality profile retrieved successfully',
    schema: {
      properties: {
        id: { type: 'string' },
        extroversionIntroversion: { type: 'number' },
        sensingIntuition: { type: 'number' },
        thinkingFeeling: { type: 'number' },
        judgingPerceiving: { type: 'number' },
        openness: { type: 'number' },
        conscientiousness: { type: 'number' },
        extraversion: { type: 'number' },
        agreeableness: { type: 'number' },
        neuroticism: { type: 'number' },
        friend: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Personality profile not found' })
  @Get()
  findOne(@Param('friendId') friendId: string, @CurrentUser() user: User) {
    return this.personalityService.findOne(friendId, user);
  }

  @ApiOperation({ summary: 'Get personality analysis' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  @ApiResponse({
    status: 200,
    description: 'Personality analysis retrieved successfully',
    schema: {
      properties: {
        mbtiType: { type: 'string' },
        mbtiScores: {
          type: 'object',
          properties: {
            extroversionIntroversion: { type: 'number' },
            sensingIntuition: { type: 'number' },
            thinkingFeeling: { type: 'number' },
            judgingPerceiving: { type: 'number' },
          },
        },
        bigFiveScores: {
          type: 'object',
          properties: {
            openness: { type: 'number' },
            conscientiousness: { type: 'number' },
            extraversion: { type: 'number' },
            agreeableness: { type: 'number' },
            neuroticism: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Personality profile not found' })
  @Get('analysis')
  getAnalysis(@Param('friendId') friendId: string, @CurrentUser() user: User) {
    return this.personalityService.getPersonalityAnalysis(friendId, user);
  }

  @ApiOperation({ summary: 'Get MBTI type' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  @ApiResponse({
    status: 200,
    description: 'MBTI type determined successfully',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({ status: 404, description: 'Personality profile not found' })
  @Get('mbti')
  getMBTIType(@Param('friendId') friendId: string, @CurrentUser() user: User) {
    return this.personalityService.getMBTIType(friendId, user);
  }

  @ApiOperation({ summary: 'Update personality profile' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  @ApiBody({ type: UpdatePersonalityDto })
  @ApiResponse({
    status: 200,
    description: 'Personality profile updated successfully',
    schema: {
      properties: {
        id: { type: 'string' },
        extroversionIntroversion: { type: 'number' },
        sensingIntuition: { type: 'number' },
        thinkingFeeling: { type: 'number' },
        judgingPerceiving: { type: 'number' },
        openness: { type: 'number' },
        conscientiousness: { type: 'number' },
        extraversion: { type: 'number' },
        agreeableness: { type: 'number' },
        neuroticism: { type: 'number' },
        friend: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Personality profile not found' })
  @Patch()
  update(
    @Param('friendId') friendId: string,
    @Body() updatePersonalityDto: UpdatePersonalityDto,
    @CurrentUser() user: User,
  ) {
    return this.personalityService.update(friendId, updatePersonalityDto, user);
  }

  @ApiOperation({ summary: 'Delete personality profile' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  @ApiResponse({
    status: 200,
    description: 'Personality profile deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Personality profile not found' })
  @Delete()
  remove(@Param('friendId') friendId: string, @CurrentUser() user: User) {
    return this.personalityService.remove(friendId, user);
  }

  @ApiOperation({ summary: 'Get compatibility score with another friend' })
  @ApiParam({ name: 'friendId', description: 'First friend ID' })
  @ApiParam({ name: 'otherFriendId', description: 'Second friend ID' })
  @ApiResponse({
    status: 200,
    description: 'Compatibility score calculated successfully',
    schema: {
      type: 'number',
      description: 'Compatibility score from 0 to 100',
    },
  })
  @ApiResponse({ status: 404, description: 'One of the friends not found' })
  @Get('compatibility/:otherFriendId')
  getCompatibility(
    @Param('friendId') friendId: string,
    @Param('otherFriendId') otherFriendId: string,
    @CurrentUser() user: User,
  ) {
    return this.personalityService.getCompatibilityScore(
      friendId,
      otherFriendId,
      user,
    );
  }
}
