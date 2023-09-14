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

  async askCoach(
    messages: Array<{ role: string; content: string }>,
  ): Promise<string> {
    try {
      const response = await this.openAi.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });

      await this.prisma.chatConversation.create({
        data: {
          role: messages[0].role,
          content: messages[0].content,
        },
      });

      const aiResponse = response.choices[0].message.content;
      await this.prisma.chatConversation.create({
        data: {
          role: 'assistant',
          content: aiResponse,
        },
      });
      return aiResponse;
    } catch (error) {
      console.error('Error asking the coach:', error);
      throw error;
    }
  }
}
