import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { UserRole } from '../../../common/constants/enum.const';

@Entity({ tableName: 't_users' })
export class User {

    @PrimaryKey()
    id!: number;

    @Property({ fieldName: 'c_lastname', nullable: true })
    lastName?: string;

    @Property({ fieldName: 'c_firstname', nullable: true })
    firstName?: string;

    @Property({ fieldName: 'c_email', nullable: true })
    email?: string;

    @Property({ fieldName: 'c_phone', nullable: true })
    phone?: string;

    @Property({ fieldName: 'c_password' })
    password!: string;

    @Enum({ items: () => UserRole, default: UserRole.DRIVER, fieldName: 'c_role' })
    role?: UserRole;

    @Property({ fieldName: 'c_created_at', onCreate: () => new Date() })
    createdAt?: Date;

    @Property({
        fieldName: 'c_updated_at',
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
    })
    updatedAt?: Date;

}
