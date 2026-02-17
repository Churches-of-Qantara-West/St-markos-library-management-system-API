import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './mailer/mailer.service';
import { UserRepository } from './repositories/user.repository';
import { VerificationRepository } from './repositories/verification.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schemas';
import { Verification, VerificationSchema } from './schemas/verification.schemas';
import { Book, BookSchema } from './schemas/booking.schemas';
import { BookRepository } from './repositories/booking.repository';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Verification.name, schema: VerificationSchema },
      { name: Book.name, schema: BookSchema },
    ]),
  ],
  providers: [UserRepository, VerificationRepository, BookRepository, MailerService],
  exports: [UserRepository, VerificationRepository, BookRepository, MailerService],
})
export class SharedModule {}
