import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "./public.decorator";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post("login")
  async login(@Body() dto: LoginDto) {
    const tokens = await this.auth.login(dto);
    return tokens;
  }

  @Public()
  @Post("refresh")
  async refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refresh_token);
  }

  @Public()
  @Post("logout")
  async logout(@Body() dto: RefreshDto) {
    await this.auth.logout(dto.refresh_token);
    return { ok: true };
  }
}
