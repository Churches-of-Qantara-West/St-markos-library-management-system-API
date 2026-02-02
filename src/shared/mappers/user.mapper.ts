import { RegisterDto } from "src/app/Auth/dto/register.dto";
import { UserModel } from "../models/user.model";

export class UserMapper {
    static registerDtoToModel(dto: RegisterDto): UserModel {
        return {
            email: dto.email,
            password: dto.password,
            isVerified: false, 
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }
}