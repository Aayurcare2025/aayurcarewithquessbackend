import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {

  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    const validKeys = [
      this.configService.get<string>('AAYURCARE_API_KEY'),
    ];

    if (!validKeys.includes(apiKey)) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
