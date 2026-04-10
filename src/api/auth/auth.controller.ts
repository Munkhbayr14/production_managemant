import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { CreateAdminDto } from './dto/admin-register.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constants/enum.const';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

import { CurrentUser } from 'src/common/decorators/current-user-decorator.ts/current-user.decorator';
import { RolesGuard } from 'src/common/decorators/roleGuard/roles.guard';
import { Roles } from 'src/common/decorators/roleGuard/roles.decorator';
import type { JwtPayload } from 'src/common/types/jwt-payload.type';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('admin-register')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    }
  })
  async createAdmin(@Body() createAdminDto: CreateAdminDto,) {
    return this.authService.createAdmin(createAdminDto, UserRole.ADMIN);
  }

  @Post('admin-login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    }
  })
  async loginAdmin(@Body() createAdminDto: CreateAdminDto,) {
    return this.authService.loginAdmin(createAdminDto,);
  }

  @Post('register/request')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles(UserRole.ADMIN)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        password: { type: 'string' },
        role: { type: 'string', example: 'DRIVER | WAREHOUSE' },
      },
    }
  })
  async registerUser(@Body() createUserDto: CreateUserDto, @CurrentUser() admin: JwtPayload,) {
    console.log("adminRole:::->  " + admin.role);
    return this.authService.createUser(createUserDto, admin.role);
  }

  @Post('register/confirm')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        otp: { type: 'string' },
      },
    }
  })
  async confirmRegister(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {
    return this.authService.confirmRegistration(email, otp);
  }

  @Post('user-login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        phone: { type: 'string' },
        password: { type: 'string' },
      },
    }
  })
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.loginUser(authLoginDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
