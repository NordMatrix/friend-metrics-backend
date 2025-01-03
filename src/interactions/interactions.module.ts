import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interaction } from './entities/interaction.entity';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';
import { FriendsModule } from '../friends/friends.module';

@Module({
  imports: [TypeOrmModule.forFeature([Interaction]), FriendsModule],
  providers: [InteractionsService],
  controllers: [InteractionsController],
  exports: [InteractionsService],
})
export class InteractionsModule {}
