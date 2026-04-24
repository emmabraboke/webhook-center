import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Permission } from '@prisma/client';
import { Env } from 'src/config/env.schema';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';
import { UserService } from 'src/modules/user/user.service';
import { BusinessMemberRepository } from 'src/modules/business-member/business-member.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService<Env>,
    private userService: UserService,
    private businessMemberRepository: BusinessMemberRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayloadDto) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('invalid token');
    }

    const user = await this.userService.findUser({ id: payload.id });

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('token has been invalidated');
    }

    const businessId = (request.params as Record<string, string>)?.businessId;
    let permissions: Permission[] = [];

    if (businessId) {
      const member = await this.businessMemberRepository.findMember(user.id, businessId);
      permissions = member?.role?.permissions ?? [];
    }

    return { id: user.id, email: user.email, role: user.role, permissions };
  }
}
