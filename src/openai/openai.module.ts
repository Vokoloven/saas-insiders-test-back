import { Module } from '@nestjs/common';
import { OpenAiService } from './openai.service';
// import { OpenAiController } from './openai.controller';
import { OpenaiGateway } from './openai.gateway';

@Module({
  providers: [OpenAiService, OpenaiGateway],
  // controllers: [OpenAiController],
})
export class OpenaiModule {}
