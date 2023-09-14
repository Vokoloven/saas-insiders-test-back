import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private openAi;
  constructor(private config: ConfigService) {
    this.openAi = new OpenAI({
      apiKey: this.config.get('OPENAI_API_KEY'),
    });
  }

  async askCoach(
    messages: Array<{ role: string; content: string }>,
  ): Promise<string> {
    try {
      const conversation = messages.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const response = await this.openAi.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: conversation,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error asking the coach:', error);
      throw error;
    }
  }
}
