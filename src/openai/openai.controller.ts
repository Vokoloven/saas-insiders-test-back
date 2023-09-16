// import { Controller, Post, Body } from '@nestjs/common';
// import { OpenAiService } from './openai.service';

// @Controller('openai')
// export class OpenAiController {
//   constructor(private readonly openAiService: OpenAiService) {}

//   @Post('ask')
//   async askCoach(
//     @Body() body: { messages: Array<{ role: string; content: string }> },
//   ): Promise<string> {
//     const { messages } = body;
//     const response = await this.openAiService.askCoach(messages);
//     return response;
//   }
// }
