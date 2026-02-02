import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './mailtrap/mailer.service';
import { UserRepository } from './repositories/user.repository';
import { VerificationRepository } from './repositories/verification.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schemas';
import {
  Verification,
  VerificationSchema,
} from './schemas/verification.schemas';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Verification.name, schema: VerificationSchema },
    ]),
  ],
  providers: [UserRepository, VerificationRepository, MailerService],
  exports: [UserRepository, VerificationRepository, MailerService],
})
export class SharedModule {}
