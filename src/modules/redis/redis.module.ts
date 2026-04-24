import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Env } from 'src/config/env.schema';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) =>
        new Redis(configService.get('REDIS_URL')),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
