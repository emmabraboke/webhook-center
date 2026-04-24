export class JwtPayloadDto {
  id: string;
  email: string;
  role: string;
  tokenVersion: number;
  type: 'access' | 'refresh';
}
