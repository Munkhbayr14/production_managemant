import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/common/constants/enum.const";

export const Roles = (...roles: UserRole[]) =>
    SetMetadata('roles', roles);
