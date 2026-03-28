export class AuthUserModel {
  id?: string;
  name: string;
  phoneNumber: string;
  password: string;
  isVerified: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
