import { IsInt, validateSync } from 'class-validator';
import 'dotenv/config';

class ConfigService {
  @IsInt()
  readonly port = Number(process.env.PORT);

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
