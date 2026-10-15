import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {

  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    const configuredKey = this.configService.get<string>('AAYURCARE_API_KEY');

    // Fail closed: if no key is configured, reject every request rather than
    // letting an empty/missing header match an empty config value.
    if (!configuredKey) {
      throw new UnauthorizedException('API key not configured');
    }

    if (apiKey !== configuredKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
