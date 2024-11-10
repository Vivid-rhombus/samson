// import { IsEnum, IsUUID } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

enum UserRole {
  User = 'user',
  Admin = 'admin',
}

export class CreateUserDto {
  // @ApiProperty()
  // @IsUUID()
  name: string;

  // @ApiProperty()
  // @IsEnum(UserRole)
  role: UserRole;
}
