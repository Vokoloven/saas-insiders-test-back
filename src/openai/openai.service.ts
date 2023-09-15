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

  async askCoach(
    messages: Array<{ role: string; content: string }>,
  ): Promise<string> {
    try {
      if (messages.some(({ content }) => content === '/status')) {
        const aiResponse = await this.createAssistantResponse([
          {
            role: 'system',
            content:
              'Do you received as well my message and we can start work?',
          },
        ]);

        await this.createConversationMessage(
          messages[0].role,
          messages[0].content,
        );
        await this.createConversationMessage('assistant', aiResponse);

        return aiResponse ?? 'Sorry, but something went wrong';
      }

      const aiResponse = await this.createAssistantResponse(messages);

      await this.createConversationMessage(
        messages[0].role,
        messages[0].content,
      );
      await this.createConversationMessage('assistant', aiResponse);

      return aiResponse;
    } catch (error) {
      console.error('Error asking the coach:', error);
      throw new Error('Failed to ask the coach.');
    }
  }
}
