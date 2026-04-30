import { Role } from "@prisma/client";
import { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    email: string;
    role: Role;
  };
};