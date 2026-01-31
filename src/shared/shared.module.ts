import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { VerificationRepository } from './repositories/verification.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schemas';
import { Verification, VerificationSchema } from './schemas/verification.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Verification.name, schema: VerificationSchema },
    ]),
  ],
  providers: [UserRepository, VerificationRepository],
  exports: [UserRepository, VerificationRepository],
})
export class SharedModule {}
