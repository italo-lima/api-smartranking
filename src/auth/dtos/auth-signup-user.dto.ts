import { IsString, IsEmail, Matches, IsMobilePhone } from "class-validator"

export class AuthSignUpUserDto {

    @IsString()
    name: string

    @IsEmail()
    email: string

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: 'senha inválida' })
    password: string

    @IsMobilePhone('pt-BR')
    cellPhone: string
}
