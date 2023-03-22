import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  JoinRoom(socket: Socket, room: string) {
    return socket.join(room);
  }

  leaveRoom(socket: Socket, room: string) {
    return socket.leave(room);
  }

  async sendMessage(
    server: Server,
    room: { room: string; message: string },
    user: User,
  ) {
    if (room.message) {
      server.to(room.room).emit('Message', {
        id: uuidv4(),
        message: room.message,
        userId: user.id,
        chatroom: room.room,
      });
      await this.prisma.messages.create({
        data: {
          id: uuidv4(),
          message: room.message,
          userId: user.id,
          chatroom: room.room,
        },
      });
    }
  }
}
