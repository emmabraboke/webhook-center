import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { GetUserQueryDto, UserDto } from './dto/user.dto';
import { Pagination, success } from 'src/common/helper/utils';
import { SuccessResponse } from 'src/common/types/response.type';
import { UserServiceInterface } from './interfaces/user.interfaces';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: Partial<UserDto>) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async findUser(where: Partial<UserDto>) {
    const user = await this.userRepository.findOne(where);
    return user;
  }

  async updateUserById(id: string, dto: Partial<UserDto>) {
    const user = await this.userRepository.updateById(id, dto);
    return user;
  }

  async incrementTokenVersion(id: string) {
    return this.userRepository.incrementTokenVersion(id);
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) throw new NotFoundException('user not found');
    const { password: _, ...userData } = user;
    return success('profile fetched successfully', userData);
  }

  async getUsers(dto: GetUserQueryDto): Promise<SuccessResponse<UserDto[]>> {
    const page = parseInt(dto.page) || 1;
    const size = parseInt(dto.size) || 20;
    const users = await this.userRepository.findPaginated(page, size);

    const { data, pagination } = Pagination(users.results, {
      page,
      limit: size,
      total: users.total,
    });

    return success('users fetched successfully', data, pagination);
  }
}
