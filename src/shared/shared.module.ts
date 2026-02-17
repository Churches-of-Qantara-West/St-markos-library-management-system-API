import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './mailer/mailer.service';
import { UserRepository } from './repositories/user.repository';
import { VerificationRepository } from './repositories/verification.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schemas';
import {
  Verification,
  VerificationSchema,
} from './schemas/verification.schemas';
import { Booking, BookingSchema } from './schemas/booking.schemas';
import { BookingRepository } from './repositories/booking.repository';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Verification.name, schema: VerificationSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  providers: [
    UserRepository,
    VerificationRepository,
    BookingRepository,
    MailerService,
  ],
  exports: [
    UserRepository,
    VerificationRepository,
    BookingRepository,
    MailerService,
  ],
})
export class SharedModule {}
