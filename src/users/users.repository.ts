import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  // digunakan untuk login dan pengecekan email unik saat register
  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  
  findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }


  update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
