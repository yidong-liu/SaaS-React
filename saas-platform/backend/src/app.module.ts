import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    AuthModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}