import { Module } from '@nestjs/common';
import { BattleRoomService } from './battle-room.service';
import { BattleRoomController } from './battle-room.controller';

@Module({
  controllers: [BattleRoomController],
  providers: [BattleRoomService],
})
export class BattleRoomModule {}
