import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { CreateAdminDto } from './dto/admin-register.dto';

import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../user/entities/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import bcrypt from 'bcrypt';
import { EntityManager } from '@mikro-orm/core';
import { UserRole } from 'src/common/constants/enum.const';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiResponseStatusModel } from 'src/common/model/api-status.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: any,
    private readonly mailerService: MailerService,
  ) { }

  async createAdmin(createAdminDto: CreateAdminDto, admin: UserRole) {
    const existingAdmin = await this.userRepo.findOne({ role: UserRole.ADMIN });
    if (!existingAdmin) {
      const hashedPassword = await this.hashData(createAdminDto.password);
      const user = this.userRepo.create({
        ...createAdminDto,
        role: admin,
        password: hashedPassword,
      });
      console.log('Created Admin:', user);
      this.em.persist(user);
      await this.em.flush();
      return {
        statusCode: 200,
        message: 'Анхны admin үүсгэгдлээ',
        email: user.email,
      };
    } else {
      throw new BadRequestException(`${existingAdmin.id} id-тай админ үүссэн байна.`);
    }
  }

  async loginAdmin(authLoginDto: AuthLoginDto,) {
    const existingAdmin = await this.userRepo.findOne({ $or: [{ email: authLoginDto.email }, { phone: authLoginDto.phone }] });

    if (!existingAdmin) {
      throw new BadRequestException('Имэйл эсвэл нууц үг буруу байна.');
    }

    const passwordMatches = await bcrypt.compare(
      authLoginDto.password,
      existingAdmin.password
    );

    if (!passwordMatches) {
      throw new BadRequestException('Имэйл эсвэл нууц үг буруу байна.');
    }
    const payload = {
      sub: existingAdmin.id,
      email: existingAdmin.email,
      role: existingAdmin.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
      email: existingAdmin.email,
      phone: existingAdmin.phone,
      id: existingAdmin.id,
      role: existingAdmin.role,
    };
  }

  async createUser(createUserDto: CreateUserDto, admin) {

    if (admin !== UserRole.ADMIN) {
      throw new UnauthorizedException('Зөвхөн админ бүртгэл үүсгэх эрхтэй');
    }

    const existingUser = await this.userRepo.findOne({ $or: [{ email: createUserDto.email }, { phone: createUserDto.phone }] });

    if (existingUser) {
      throw new BadRequestException(`${existingUser.id} id-тай хэрэглэгч бүртгэлтэй байна.`);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await this.hashData(createUserDto.password);

    const tempData = { ...createUserDto, password: hashedPassword, otp };
    await this.cacheManager.set(`otp_reg_${createUserDto.email}`, tempData, 600000);

    await this.mailerService.sendMail({
      to: createUserDto.email,
      subject: 'Бүртгэл баталгаажуулах код',
      text: `Таны код: ${otp}`,
    });

    return {
      statusCode: 200,
      status: ApiResponseStatusModel.SUCCESS,
      message: 'Баталгаажуулах код иймэйл рүү илгээгдлээ',
    };
  }

  async confirmRegistration(email: string, otp: string) {

    const tempData: any = await this.cacheManager.get(`otp_reg_${email}`);
    console.log("tempData:::->  " + JSON.stringify(tempData));

    if (!tempData) {
      throw new BadRequestException('Кодны хугацаа дууссан эсвэл бүртгэл олдсонгүй');
    }

    if (tempData.otp !== otp) {
      throw new BadRequestException('Буруу код оруулсан байна');
    }

    const { otp: _, ...userData } = tempData;

    const user = this.userRepo.create(userData);
    this.em.persist(user);
    await this.em.flush();

    await this.cacheManager.del(`otp_reg_${email}`);

    return {
      statusCode: 200,
      status: ApiResponseStatusModel.SUCCESS,
      message: 'Хэрэглэгч амжилттай бүртгэгдлээ',
      result: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      }
    };
  }

  async loginUser(authLoginDto: AuthLoginDto) {

    const searchField = authLoginDto.email ? { email: authLoginDto.email } : { phone: authLoginDto.phone };

    const existingUser = await this.userRepo.findOne({ ...searchField, });

    if (!existingUser) {
      throw new BadRequestException('Имэйл эсвэл нууц үг буруу байна.');
    }

    const passwordMatches = await bcrypt.compare(
      authLoginDto.password,
      existingUser.password
    );

    if (!passwordMatches) {
      throw new BadRequestException('Имэйл эсвэл нууц үг буруу байна.');
    }
    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      phone: existingUser.phone,
      role: existingUser.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
      id: existingUser.id,
      email: existingUser.email,
      phone: existingUser.phone,
      role: existingUser.role,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  private async hashData(data: string) {
    return await bcrypt.hash(data, 12);
  }
}
