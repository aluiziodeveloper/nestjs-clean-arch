import { SigninUseCase } from '@/users/application/usecases/signin.usecase'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SigninDto implements SigninUseCase.Input {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
