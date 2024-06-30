import { UserRoles } from '../enum/role.enum';
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<UserRoles[]>();
