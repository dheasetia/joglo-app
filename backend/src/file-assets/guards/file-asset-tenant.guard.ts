import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DEFAULT_TENANT_ID } from '../../storage/storage.constants';

@Injectable()
export class FileAssetTenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId =
      request.body?.tenantId || request.query?.tenantId || DEFAULT_TENANT_ID;

    if (!user) {
      throw new ForbiddenException('User tidak terautentikasi.');
    }

    if (user.role === 'ADMIN') {
      return true;
    }

    if (tenantId !== DEFAULT_TENANT_ID) {
      throw new ForbiddenException('Akses tenant ditolak.');
    }

    return true;
  }
}
