import { SuccessResponse } from 'src/common/types/response.type';
import { GetUserQueryDto, UserDto } from '../dto/user.dto';

export interface UserServiceInterface {
  createUser(dto: Partial<UserDto>): Promise<UserDto>;
  findUser(where: Partial<UserDto>): Promise<UserDto>;
  updateUserById(id: string, dto: Partial<UserDto>): Promise<UserDto>;
  getUsers(dto: GetUserQueryDto): Promise<SuccessResponse<UserDto[]>>;
}
