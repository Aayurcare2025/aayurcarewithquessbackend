import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from "class-validator";
import { UserRole } from "src/enum/ole.enum";

export class UserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  // @IsEnum(UserRole, { message: "Role must be a valid UserRole" })
  // role: UserRole;
  // @IsEnum(UserRole, { message: "Role must be a valid UserRole" }) 
  role: UserRole;
}
