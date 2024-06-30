import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { PasswordHelper } from 'src/common/helper/password';
import { loginResponse, success } from 'src/common/types/response.type';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/common/enum/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const { password, ...userData } = dto;

    const hashedPassword = await PasswordHelper.hashPassword(password);

    const user = await this.userService.createUser({
      ...userData,
      role: UserRoles.User,
      password: hashedPassword,
    });

    return success('user created successfully', user);
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userService.findUser({ email });

    if (!user) {
      throw new UnauthorizedException('invalid email or password');
    }

    const match = await PasswordHelper.comparePassword(password, user.password);

    if (!match) {
      throw new UnauthorizedException('invalid email or password');
    }

    const { id, firstName, lastName, role } = user;

    const token = this.jwtService.sign({ id, email, role });

    return loginResponse(
      'login successful',
      {
        id,
        email,
        firstName,
        lastName,
      },
      token,
    );
  }
}
