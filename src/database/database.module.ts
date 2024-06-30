import 'dotenv/config';
import { Global, Module } from '@nestjs/common';
import * as Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';
import { Config } from 'src/config/config';
import {
  BusinessMemberInviteModel,
  BusinessMemberModel,
  BusinessModel,
  ProjectModel,
  UserModel,
  WebhookEndpointModel,
  WebhookEventModel,
} from './models';

const models = [
  UserModel,
  BusinessModel,
  BusinessMemberInviteModel,
  ProjectModel,
  BusinessMemberModel,
  WebhookEventModel,
  WebhookEndpointModel,
];

const modelProviders = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const knex = Knex.knex({
        client: 'pg',
        debug: false,
        connection: Config.databaseURL || {
          host: Config.databaseHost,
          database: Config.databaseName,
          user: Config.databaseUser,
          password: Config.databasePassword,
        },
        pool: {
          min: 0,
          max: 10,
          acquireTimeoutMillis: 60000,
          idleTimeoutMillis: 600000,
        },

        ...knexSnakeCaseMappers(),
      });

      Model.knex(knex);
      return knex;
    },
  },
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}
