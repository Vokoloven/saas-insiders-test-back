import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OpenAiService {
  private openAi;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.openAi = new OpenAI({
      apiKey: config.get('OPENAI_API_KEY'),
    });
  }

  private async createAssistantResponse(
    messages: Array<{ role: string; content: string }>,
  ): Promise<string> {
    const response = await this.openAi.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    return response.choices[0].message.content;
  }

  private async createConversationMessage(
    role: string,
    content: string,
  ): Promise<void> {
    await this.prisma.chatConversation.create({
      data: {
        role,
        content,
      },
    });
  }

  async getAllChatConversations() {
    try {
      const chatConversation = await this.prisma.chatConversation.findMany();
      return chatConversation;
    } catch (error) {
      console.error('Error getting chat conversations:', error);
      throw new Error('Failed to retrieve chat conversations.');
    }
  }

  async askCoach(
    messages: Array<{ role: string; content: string }>,
  ): Promise<{ role: string; content: string }> {
    try {
      if (messages.some(({ content }) => content === '/status')) {
        return { role: 'system', content: 'Chat work properly!' };
      }

      const aiResponse = await this.createAssistantResponse(messages);

      await this.createConversationMessage(
        messages[0].role,
        messages[0].content,
      );
      await this.createConversationMessage('assistant', aiResponse);

      return { role: 'assistant', content: aiResponse };
    } catch (error) {
      console.error('Error asking the coach:', error);
      throw new Error('Failed to ask the coach.');
    }
  }
}
