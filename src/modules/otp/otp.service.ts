import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';
import { OtpActions } from 'src/common/enum/otp-actions.enum';
import { Utils } from 'src/common/helper/utils';
import { REDIS_CLIENT } from 'src/modules/redis/redis.module';

interface OtpData {
  email: string;
  otp: string;
}

@Injectable()
export class OtpService {
  constructor(@Inject(REDIS_CLIENT) private redis: Redis) {}

  async createOtp(email: string, action: OtpActions, ttl = 600) {
    const otp = Utils.generateOtp(6).toString();
    const otpId = randomUUID();
    const key = `otp:${action}:${otpId}`;
    await this.redis.setex(key, ttl, JSON.stringify({ email, otp }));
    return { otpId, otp };
  }

  async getOtp(otpId: string, action: OtpActions): Promise<OtpData | null> {
    const key = `otp:${action}:${otpId}`;
    const raw = await this.redis.get(key);
    return raw ? (JSON.parse(raw) as OtpData) : null;
  }

  async deleteOtp(otpId: string, action: OtpActions) {
    const key = `otp:${action}:${otpId}`;
    await this.redis.del(key);
  }
}
