import { z } from 'zod';
import { parseBoolean } from 'src/common/helper/parse-boolean.helper';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number().default(587),
  MAIL_SECURE: z.preprocess(parseBoolean, z.boolean()).default(false),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  MAIL_FROM: z.string(),
  REDIS_URL: z.string(),
  CORS_ORIGINS: z.string(),
});

export type Env = z.infer<typeof envSchema>;
