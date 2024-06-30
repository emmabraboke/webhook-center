import { FactoryProvider, Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { BusinessModel } from 'src/database/models';
import { BusinessRepository } from './business.repository';
import { BusinessToken } from './business.token';

const providers: FactoryProvider[] = [
  {
    provide: BusinessToken.BusinessRepository,
    useFactory: () => {
      return new BusinessRepository(BusinessModel);
    },
  },
];

@Module({
  controllers: [BusinessController],
  providers: [BusinessService, ...providers],
})
export class BusinessModule {}
