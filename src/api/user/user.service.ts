import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { UserRole } from 'src/common/constants/enum.const';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
  ) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async checkAdmin(id: number) {
    const user = await this.userRepo.findOne({
      id: id,
    });

    if (!user) {
      throw new BadRequestException(`${id}тай хэрэглэгч олдсонгүй`);
    }

    if (user.role === UserRole.ADMIN) {
      return true
    } else {
      return false
    }
  }
}
