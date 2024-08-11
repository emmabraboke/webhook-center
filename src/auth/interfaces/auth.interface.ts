import { LoginResponse, SuccessResponse } from 'src/common/types/response.type';
import { CreateUserDto, ForgotPasswordDto, LoginDto } from '../dto/auth.dto';
import { UserModel } from 'src/database/models';

export interface AuthInterface {
  createUser(dto: CreateUserDto): Promise<SuccessResponse<UserModel>>;
  login(dto: LoginDto): Promise<LoginResponse<Partial<UserModel>>>;
  forgotPassword(dto: ForgotPasswordDto): Promise<SuccessResponse<unknown>>;
  resetPassword(dto: any): Promise<SuccessResponse<unknown>>;
}
