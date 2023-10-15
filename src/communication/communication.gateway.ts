import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { CommunicationService } from './communication.service';
import {  Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io'
import * as url from "url"

//   // 订阅消息
//   @SubscribeMessage('newMessage')
//   handleMessage(@MessageBody() body:any ,@ConnectedSocket() client: Socket){
//       client.emit('onMessage')
//       this.server.emit('onMessage', {
//           msg: 'new Message',
//           content: body
//       })
//       console.log(body)
//   }

@WebSocketGateway({
  // namespace:'set',  // 命名空间,
  // transports: ['websocket'],   // 支持选项
  cors:{origin:'*'}
})
export class CommunicationGateway {

    @WebSocketServer()
    server: Server

  constructor(private readonly communicationService: CommunicationService) {}

  @SubscribeMessage('message')
  handleMessage( 
    // 访问连接的 socket 实例
    @ConnectedSocket() client: Socket , @MessageBody() data

   ) {
     //向除自己以外的人广播
      client.broadcast.emit('message',data)
      Logger.log(client.id)
  }


}
