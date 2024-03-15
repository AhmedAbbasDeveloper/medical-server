import * as toJson from '@meanie/mongoose-to-json';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { DosesModule } from './doses/doses.module';
import { MedicationsModule } from './medications/medications.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      connectionFactory: (connection) => {
        connection.plugin(toJson);
        return connection;
      },
    }),
    AuthModule,
    DosesModule,
    MedicationsModule,
    UsersModule,
  ],
})
export class AppModule {}
