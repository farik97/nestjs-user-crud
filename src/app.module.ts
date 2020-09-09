import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { user } from './user/models/user.entity';

@Module({

  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DATABASE_PASSWORD,
      database: 'user-auth',
      entities: [user],
      synchronize: true

    }),
    AuthModule,
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}