import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { BookModule } from './app/book/book.module';
import { BookingModule } from './app/booking/booking.module';
import { InfrastructureModule } from './Infrastructure/infrastrcture.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './app/Auth/auth.module';
import { CategoryModule } from './app/category/category.module';
import { UserModule } from './app/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || '',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SharedModule,
    BookModule,
    BookingModule,
    CategoryModule,
    InfrastructureModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
