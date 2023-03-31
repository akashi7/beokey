import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { ChatGateway } from './chat.gateway';
import { ConversationService } from './conversation.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [ChatGateway, ConversationService, JwtStrategy],
})
export class ChatModule {}
