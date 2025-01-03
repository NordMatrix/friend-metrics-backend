import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Personality } from './entities/personality.entity';
import { PersonalityService } from './personality.service';
import { PersonalityController } from './personality.controller';
import { FriendsModule } from '../friends/friends.module';

@Module({
  imports: [TypeOrmModule.forFeature([Personality]), FriendsModule],
  providers: [PersonalityService],
  controllers: [PersonalityController],
  exports: [PersonalityService],
})
export class PersonalityModule {}
