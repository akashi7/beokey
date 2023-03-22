import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AllowRoles } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ConversationService } from './conversation.service';

@WebSocketGateway({ cors: { origin: ['http:localhost:3000'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ConversationService,
    private Jwt: JwtService,
    private config: ConfigService,
  ) {}

  @WebSocketServer() server: Server;

  @UseGuards(JwtGuard, RolesGuard)
  @AllowRoles(ERoles.DOCTOR, ERoles.PATIENT)
  async handleConnection(socket: Socket) {
    const token = socket.handshake.query.token;
    const jwtToken = await this.Jwt.verifyAsync(
      typeof token === 'string' ? token : '',
      {
        secret: this.config.get('JWT_SECRET'),
      },
    );
    if (jwtToken) {
      socket.data.user = jwtToken;
      console.log('CONNECTION SUCCESS');
    } else this.handleDisconnect();
  }
  handleDisconnect() {
    console.log('CONNECTION REMOVED');
  }

  @SubscribeMessage('joinRoom')
  joinRoom(socket: Socket, room: string) {
    return this.chatService.JoinRoom(socket, room);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(socket: Socket, room: string) {
    return this.chatService.leaveRoom(socket, room);
  }

  @SubscribeMessage('sendMessage')
  sendMessage(socket: Socket, room: { room: string; message: string }) {
    return this.chatService.sendMessage(this.server, room, socket.data.user);
  }
}
