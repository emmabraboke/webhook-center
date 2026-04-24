import { ClassSerializerInterceptor, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { validate } from './config/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database/database.module';
import { BusinessModule } from './modules/business/business.module';
import { ProjectModule } from './modules/project/project.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { WebhookEndpointModule } from './modules/webhook-endpoint/webhook-endpoint.module';
import { BusinessMemberModule } from './modules/business-member/business-member.module';
import { MemberInviteModule } from './modules/member-invite/member-invite.module';
import { RoleModule } from './modules/role/role.module';
import { JwtStrategy } from './common/strategy/jwt.strategy';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from './modules/redis/redis.module';
import { MailModule } from './modules/mail/mail.module';
import { HealthModule } from './modules/health/health.module';
import { Env } from './config/env.schema';
import { BullModule } from '@nestjs/bullmq';
import { EventDeliveryModule } from './modules/event-delivery/event-delivery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env>) => ({
        connection: { url: configService.get('REDIS_URL') },
      }),
    }),
    DatabaseModule,
    RedisModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24hr' },
      }),
      global: true,
    }),
     AuthModule,
    UserModule,
    BusinessModule,
    ProjectModule,
    MailModule,
    EventDeliveryModule,
    WebhookModule,
    WebhookEndpointModule,

    BusinessMemberModule,
    MemberInviteModule,
    RoleModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    Logger,
    JwtStrategy,
  ],
})
export class AppModule {}
