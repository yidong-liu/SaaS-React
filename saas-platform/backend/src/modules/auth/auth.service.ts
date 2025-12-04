import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    return this.usersService.createUser(authCredentialsDto);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.validateUserPassword(authCredentialsDto);
    const accessToken = this.jwtService.sign({ username: user.username, sub: user.id });
    return { accessToken };
  }

  async getProfile(userId: string) {
    const tenant = await this.usersService['prisma'].tenant.findFirst();
    if (!tenant) {
      throw new Error('No tenant found');
    }
    return this.usersService.findOne(userId, tenant.id);
  }
}