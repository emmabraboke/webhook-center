import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { PasswordHelper } from 'src/common/helper/password';
import {
  LoginResponse,
  loginSuccess,
  success,
  SuccessResponse,
} from 'src/common/types/response.type';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/common/enum/role.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Utils } from 'src/common/helper/utils';
import { MailService } from 'src/mail/mail.service';
import { AuthInterface } from './interfaces/auth.interface';
import { UserModel } from 'src/database/models';

@Injectable()
export class AuthService implements AuthInterface {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(dto: CreateUserDto): Promise<SuccessResponse<UserModel>> {
    const { password, ...userData } = dto;

    const hashedPassword = await PasswordHelper.hashPassword(password);

    const user = await this.userService.createUser({
      ...userData,
      role: UserRoles.User,
      password: hashedPassword,
    });

    return success('user created successfully', user);
  }

  async login(dto: LoginDto): Promise<LoginResponse<Partial<UserModel>>> {
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

    return loginSuccess(
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

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<SuccessResponse<unknown>> {
    const { email } = dto;
    const user = await this.userService.findUser({ email });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const otp = Utils.generateOtp(6).toString();

    const key = `password-reset:${user.id}`;

    await this.cacheManager.set(key, otp, 100000);

    await this.mailService.sendPasswordResetEmail({ email, otp });

    return success('otp sent to email');
  }

  async resetPassword(
    data: ResetPasswordDto,
  ): Promise<SuccessResponse<unknown>> {
    const { email, otp, password } = data;
    const user = await this.userService.findUser({ email });

    const key = `$password-reset:${user.id}`;

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const savedOtp = await this.cacheManager.get(key);

    if (savedOtp !== otp) {
      throw new BadRequestException('invalid otp');
    }

    const encryptedPassword = await PasswordHelper.hashPassword(password);

    await this.userService.updateUserById(user.id, {
      password: encryptedPassword,
    });

    await this.cacheManager.del(key);

    return success('password reset successful');
  }
}
