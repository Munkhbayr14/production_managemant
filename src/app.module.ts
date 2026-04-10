import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import databaseConfig from 'src/mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { TransactionModule } from './api/transaction/transaction.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: () => databaseConfig,
      }
    ),
    CacheModule.register({
      isGlobal: true,
      ttl: 600000,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <monhbayrm15@gmail.com>',
      },
    }),
    AuthModule,
    UserModule,
    TransactionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
