import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthRoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	public canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		const role = request.role;

		if (!roles?.length) return true;

		return roles.includes(role);
	}
}
