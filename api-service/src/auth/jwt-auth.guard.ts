import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { jwtVerify, type JWTPayload } from "jose";
import { IS_PUBLIC_KEY } from "./public.decorator";

export type AuthUser = JWTPayload & {
  username?: string;
  email?: string;
  name?: string;
  roles?: string[];
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private secret: Uint8Array;

  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {
    this.secret = new TextEncoder().encode(
      this.config.getOrThrow<string>("JWT_SECRET"),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: AuthUser;
    }>();

    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    try {
      const { payload } = await jwtVerify(header.slice(7), this.secret);
      request.user = payload as AuthUser;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
