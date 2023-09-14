import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [OpenaiModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
