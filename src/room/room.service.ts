import { Injectable } from '@nestjs/common';
import { User, chatroom } from '@prisma/client';
import { ERoles } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Convo } from './interface';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversation(user: User, id: string) {
    if (user.role === ERoles.DOCTOR) {
      const roomMessages = await this.prisma.messages.findMany({
        where: { chatroom: id },
      });

      return {
        chatRoom: id,
        messages: roomMessages,
      };
    } else {
      const roomExists = await this.prisma.chatroom.findFirst({
        where: {
          OR: [
            { AND: [{ firstUser: id }, { secondUser: user.id }] },
            { AND: [{ secondUser: id }, { firstUser: user.id }] },
          ],
        },
      });
      if (roomExists) {
        const messages = await this.prisma.messages.findMany({
          where: {
            chatroom: roomExists.id,
          },
        });
        return {
          chatRoom: roomExists.id,
          messages,
        };
      } else {
        const createdRoom = await this.prisma.chatroom.create({
          data: {
            id: uuidv4(),
            firstUser: user.id,
            secondUser: id,
          },
        });
        if (createdRoom) {
          const messages = await this.prisma.messages.findMany({
            where: {
              chatroom: createdRoom.id,
            },
          });
          return { chatRoom: createdRoom.id, messages };
        }
      }
    }
  }

  async getDocConversation(user: User): Promise<Convo[]> {
    const conversations: chatroom[] = await this.prisma.chatroom.findMany({
      where: {
        OR: [{ firstUser: user.id }, { secondUser: user.id }],
      },
    });

    const filteredConvo = await Promise.all(
      conversations.map(async (convo: chatroom) => {
        const user = await this.prisma.user.findFirst({
          where: { id: convo.firstUser },
        });
        return {
          id: convo.id,
          patient: user.fullNames,
        };
      }),
    );

    return filteredConvo;
  }
}
