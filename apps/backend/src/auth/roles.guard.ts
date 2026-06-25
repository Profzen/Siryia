import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // No roles required
    }
    const { user } = context.switchToHttp().getRequest();
    
    // In our JWT, we should embed the user's roles, or fetch them here
    // For now we assume req.user.roles is an array of strings (e.g. ['ADMIN'])
    // We will throw a forbidden exception if not found
    if (!user || !user.roles) {
      throw new ForbiddenException("Vous n'avez pas les droits nécessaires pour effectuer cette action.");
    }

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    if (!hasRole) {
       throw new ForbiddenException("Vous n'avez pas les droits nécessaires pour effectuer cette action.");
    }
    return true;
  }
}
