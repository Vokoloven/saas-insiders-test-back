import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OpenAiService } from './openai.service';

@WebSocketGateway()
export class OpenaiGateway {
  @WebSocketServer()
  server;

  constructor(private readonly openAiService: OpenAiService) {}

  @SubscribeMessage('askCoach')
  async handleAskCoach(@MessageBody() messages: any): Promise<void> {
    try {
      const response = await this.openAiService.askCoach(messages);
      this.server.emit('aiResponse', response);
    } catch (error) {
      console.error('Error asking the coach:', error);
      this.server.emit('aiResponse', 'Sorry, something went wrong.');
    }
  }
}
