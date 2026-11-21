import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Messagerie & Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversation/:id/messages')
  @ApiOperation({ summary: 'Consulter l historique paginé des messages d une conversation' })
  getMessages(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.chatService.getConversationMessages(userId, conversationId, pageNum, limitNum);
  }

  @Post('message')
  @ApiOperation({ summary: 'Envoyer un message texte ou média dans une conversation' })
  @ApiResponse({ status: 201, description: 'Message envoyé' })
  sendMessage(
    @CurrentUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(userId, dto);
  }

  @Post('conversation/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marquer les messages reçus d une conversation comme lus' })
  markAsRead(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.chatService.markAsRead(userId, conversationId);
  }
}
