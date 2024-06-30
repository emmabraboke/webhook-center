import { FactoryProvider, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserModel } from 'src/database/models';
import { UserToken } from './user.token';

const providers: FactoryProvider[] = [
  {
    provide: UserToken.UserRepository,
    useFactory: () => {
      return new UserRepository(UserModel);
    },
  },
];

@Module({
  controllers: [UserController],
  providers: [UserService, ...providers],
  exports: [UserService],
})
export class UserModule {}
