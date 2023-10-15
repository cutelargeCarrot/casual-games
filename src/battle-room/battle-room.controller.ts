import { Body, Controller, Delete, Get, Post, Query, Sse } from '@nestjs/common';
import { BattleRoomService } from './battle-room.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { RoomCreateDto } from './dto/room-create.dto';
import { generateParseIntPipe } from 'src/utils';
import { UserData } from 'src/interfaces/user-data.interface';
import { Observable, interval, map } from 'rxjs';

@ApiTags('战局')
@Controller('battle-room')
export class BattleRoomController {

  private SseSend = {}
  constructor(private readonly battleRoomService: BattleRoomService) {}

  @ApiOperation({summary:'查找房间'})
  @Get('room')
  @RequireLogin()
  async roomList(
      @Query('pageNo', generateParseIntPipe('pageNo')) pageNo:number, 
      @Query('pageSize', generateParseIntPipe('pageSize')) pageSize:number,
      @Query('name') name:string ) {
    return await this.battleRoomService.roomList(pageNo,pageSize,name)
  }

  @ApiOperation({summary:'创建房间'})
  @Post('room')
  @RequireLogin()
  async roomCreate(@UserInfo() userInfo:UserData,@Body() data:RoomCreateDto) {
    return await this.battleRoomService.roomCreate(userInfo,data)
  }

  @Sse('SSE')
  sse(): Observable<MessageEvent> {
    return new Observable<any>(observer => {
      
    })
  }

  @ApiOperation({summary:'SSE邀请推送'})
  @Post()
  @RequireLogin()
  sendinterval(){

  }

  @ApiOperation({summary:'加入房间'})
  @Get('player')
  @RequireLogin()
  async enterRoom( @UserInfo() userInfo:UserData,@Query('id') roomId:number){
    return await this.battleRoomService.enterRoom(userInfo,roomId)
  }

  @ApiOperation({summary:'退出房间'})
  @Delete('player')
  @RequireLogin()
  async leaveRoom(@UserInfo('userId') userId:number,@Query('id') roomId:number){
  }

  @ApiOperation({summary:'解散房间'})
  @Delete('room')
  @RequireLogin()
  async roomDelete( @UserInfo('userId') userId:number , @Query('id') roomId:number){
    return await this.battleRoomService.roomDelete(userId,roomId)
  }
}
