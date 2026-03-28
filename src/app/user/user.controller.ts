import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':phoneNumber')
  findOne(@Param('phoneNumber') phoneNumber: string) {
    return this.userService.findOne(phoneNumber);
  }
  
}
