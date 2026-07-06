import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";
import { CassandraService } from "../cassandra/cassandra.service";
import type { LoginDto } from "./auth.dto";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

export interface AuthUserRecord {
  username: string;
  password_hash: string;
  name: string;
  email: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  private secret: Uint8Array;
  private accessTtl: number;
  private refreshTtl: number;

  constructor(
    private readonly cassandra: CassandraService,
    private readonly config: ConfigService,
  ) {
    this.secret = new TextEncoder().encode(
      this.config.getOrThrow<string>("JWT_SECRET"),
    );
    this.accessTtl = Number(this.config.get<string>("JWT_ACCESS_TTL") ?? 900);
    this.refreshTtl = Number(
      this.config.get<string>("JWT_REFRESH_TTL") ?? 604800,
    );
  }

  async login(dto: LoginDto): Promise<TokenResponse> {
    const user = await this.findAuthUser(dto.username);
    if (!user) {
      throw new UnauthorizedException("Invalid username or password");
    }

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException("Invalid username or password");
    }

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    let payload: { sub?: string; jti?: string };
    try {
      const verified = await jwtVerify(refreshToken, this.secret);
      payload = verified.payload as { sub?: string; jti?: string };
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    if (!payload.sub || !payload.jti) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const stored = await this.cassandra.execute(
      "SELECT username, expires_at FROM refresh_tokens WHERE token_id = ?",
      [payload.jti],
    );
    const row = stored.first();
    if (!row || row.username !== payload.sub) {
      throw new UnauthorizedException("Refresh token revoked");
    }

    const user = await this.findAuthUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    await this.cassandra.execute(
      "DELETE FROM refresh_tokens WHERE token_id = ?",
      [payload.jti],
    );

    return this.issueTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const { payload } = await jwtVerify(refreshToken, this.secret);
      const jti = payload.jti as string | undefined;
      if (jti) {
        await this.cassandra.execute(
          "DELETE FROM refresh_tokens WHERE token_id = ?",
          [jti],
        );
      }
    } catch {
      // Ignore invalid tokens on logout
    }
  }

  private async findAuthUser(
    username: string,
  ): Promise<AuthUserRecord | null> {
    const result = await this.cassandra.execute(
      "SELECT username, password_hash, name, email, roles FROM auth_users WHERE username = ?",
      [username],
    );
    const row = result.first();
    if (!row) return null;

    return {
      username: row.username as string,
      password_hash: row.password_hash as string,
      name: row.name as string,
      email: row.email as string,
      roles: (row.roles as Set<string>) ? Array.from(row.roles as Set<string>) : [],
    };
  }

  private async issueTokens(user: AuthUserRecord): Promise<TokenResponse> {
    const now = Math.floor(Date.now() / 1000);
    const accessToken = await new SignJWT({
      username: user.username,
      name: user.name,
      email: user.email,
      roles: user.roles,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.username)
      .setIssuedAt()
      .setExpirationTime(now + this.accessTtl)
      .sign(this.secret);

    const jti = randomUUID();
    const refreshToken = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.username)
      .setJti(jti)
      .setIssuedAt()
      .setExpirationTime(now + this.refreshTtl)
      .sign(this.secret);

    const expiresAt = new Date(Date.now() + this.refreshTtl * 1000);
    await this.cassandra.execute(
      "INSERT INTO refresh_tokens (token_id, username, expires_at) VALUES (?, ?, ?)",
      [jti, user.username, expiresAt],
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.accessTtl,
      refresh_expires_in: this.refreshTtl,
      token_type: "Bearer",
    };
  }
}
