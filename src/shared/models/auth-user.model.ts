export class AuthUserModel {
  id?: string;
  name: string;
  phoneNumber: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
