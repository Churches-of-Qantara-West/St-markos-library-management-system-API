import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './mailer/mailer.service';
import { UserRepository } from './repositories/user.repository';
import { VerificationRepository } from './repositories/verification.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schemas';
import { Verification, VerificationSchema } from './schemas/verification.schemas';
import { Book, BookSchema } from './schemas/book.schemas';
import { BookRepository } from './repositories/book.repository';
import { BookingRepository } from './repositories/booking.repository';
import { Booking, BookingSchema } from './schemas/booking.schemas';
import { Category, CategorySchema } from './schemas/category.schemas';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Verification.name, schema: VerificationSchema },
      { name: Book.name, schema: BookSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [UserRepository, VerificationRepository, BookRepository, BookingRepository, CategoryRepository, MailerService],
  exports: [UserRepository, VerificationRepository, BookRepository, BookingRepository, CategoryRepository, MailerService],
})
export class SharedModule {}
