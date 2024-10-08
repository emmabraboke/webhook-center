import { IsInt, IsOptional, IsString, validateSync } from 'class-validator';
import 'dotenv/config';

class ConfigService {
  @IsInt()
  readonly port = Number(process.env.PORT);

  @IsString()
  @IsOptional()
  readonly databaseURL = process.env.DATABASE_URL;

  @IsString()
  readonly databaseHost = process.env.DATABASE_HOST;

  @IsString()
  readonly databaseName = process.env.DATABASE_NAME;

  @IsString()
  readonly databaseUser = process.env.DATABASE_USER;

  @IsString()
  readonly databasePassword = process.env.DATABASE_PASSWORD;

  @IsString()
  readonly jwtSecret = process.env.JWT_SECRET;

  @IsString()
  readonly mailgunApiKey = process.env.MAILGUN_API_KEY;

  @IsString()
  readonly mailgunDomain = process.env.MAILGUN_DOMAIN;

  @IsString()
  readonly mailgunFrom = process.env.MAILGUN_FROM;

  @IsString()
  readonly mailgunTo = process.env.MAILGUN_TO;

  constructor() {
    this.validateConfigs();
  }

  private validateConfigs(): void {
    const errors = validateSync(this);
    if (errors.length > 0) {
      const message = errors
        .map((err) => Object.values(err.constraints).join(', '))
        .join('; ');
      throw new Error(message);
    }
  }
}

export const Config = new ConfigService();
