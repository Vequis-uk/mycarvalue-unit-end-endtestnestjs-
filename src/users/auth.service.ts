import { UsersService } from './users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if the email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // 1. Has the users password
    // 1a. Generate the salt - this adds extra hash to make it more secure
    const salt = randomBytes(8).toString('hex');

    // 1b. Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // 1c. Join the hashed result and the salt together - stored in DB
    const result = salt + '.' + hash.toString('hex');

    // 2. Create a new user and save it
    const user = await this.usersService.create(email, result);

    // 3. Return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Incorrect Password');
    }
    return user;
  }
}
