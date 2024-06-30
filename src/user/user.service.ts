import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserToken } from './user.token';
import { CreateUserDto } from 'src/auth/dto/auth.dto';
import { GetUserQueryDto, UserDto } from './dto/user.dto';
import { parse } from 'path';
import { success } from 'src/common/types/response.type';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserToken.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(dto: Partial<UserDto>) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async findUser(dto: Partial<UserDto>) {
    const user = await this.userRepository.findOne(dto);
    return user;
  }

  async getUsers(dto: GetUserQueryDto) {
    const page = parseInt(dto.page) || 1;
    const size = parseInt(dto.size) || 20;
    const users = await this.userRepository.findPaginated(page, size);

    const pagination = {
      total: users.total,
      pageSize: size,
      currentPage: page,
    };

    return success('users fetched successfully', users.results, pagination);
  }
}
