import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class SubmissionsRepository {
    constructor(private readonly Prisma: PrismaService) {}

    
}