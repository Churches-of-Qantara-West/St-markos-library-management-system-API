export class UserModel {
  id?: string;
  name: string;
  phoneNumber: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
