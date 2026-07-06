import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { IS_PUBLIC_KEY } from "./public.decorator";

export type AuthUser = JWTPayload & {
  name?: string;
  displayName?: string;
  email?: string;
  roles?: string[];
};

function extractRoles(roles: unknown): string[] {
  if (!Array.isArray(roles)) return [];
  return roles.map((role) =>
    typeof role === "string" ? role : ((role as { name?: string }).name ?? ""),
  ).filter(Boolean);
}

@Injectable()
export class CasdoorAuthGuard implements CanActivate {
  private jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {
    const url = this.config.getOrThrow<string>("CASDOOR_URL");
    this.jwks = createRemoteJWKSet(new URL(`${url}/.well-known/jwks`));
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
      const { payload } = await jwtVerify(header.slice(7), this.jwks);
      const roles = extractRoles((payload as { roles?: unknown }).roles);
      request.user = {
        ...(payload as JWTPayload),
        roles,
      };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
