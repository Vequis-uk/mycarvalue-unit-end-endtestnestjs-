import { IsEmail, IsString} from 'class-validator'
import {} from 'class-transformer'

export class CreateUserDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}