import { Controller, Get, NotFoundException } from '@nestjs/common';
import { OpenAiService } from './openai.service';

@Controller('openai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Get('')
  async getAllChatConversations() {
    try {
      const chatConversation =
        await this.openAiService.getAllChatConversations();
      if (!Boolean(chatConversation.length)) {
        throw new NotFoundException(`No chat conversations found`);
      }
      return chatConversation;
    } catch (error) {
      throw new Error(`Failed to get chat conversations: ${error.message}`);
    }
  }
}
