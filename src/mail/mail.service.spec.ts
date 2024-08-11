import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { Config } from '../config/config';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send password reset email', async () => {
    const data = {
      otp: '123456',
      email: Config.mailgunTo,
    };

    const response = await service.sendPasswordResetEmail(data);

    expect(response).toBe(true);
  });
});
