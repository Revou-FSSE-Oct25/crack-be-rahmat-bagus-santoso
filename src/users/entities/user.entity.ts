import { Role } from "@prisma/client";
import type { Child } from '../../children/entities/child.entity';

export class User {
    id!: string;
    name!: string;
    email!: string;
    password!: string;
    role!: Role;
    createdAt!: Date;
    children?: Child[];
}
