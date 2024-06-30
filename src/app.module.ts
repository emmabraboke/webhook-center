import { ClassSerializerInterceptor, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Config } from './config/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database/database.module';
import { BusinessModule } from './business/business.module';
import { JwtStrategy } from './common/strategy/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    JwtModule.register({
      secret: Config.jwtSecret,
      signOptions: { expiresIn: '24hr' },
      global: true,
    }),
    BusinessModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    Logger,
    JwtStrategy,
  ],
})
export class AppModule {}
