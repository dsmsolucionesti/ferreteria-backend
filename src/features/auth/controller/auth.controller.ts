import { JsonController, Post, Body } from "routing-controllers";
import { AuthService } from "../services/auth.service";

@JsonController("/auth")
export class AuthController {
  private _authService = new AuthService();

  @Post("/login")
  async login(@Body() body: any) {
    console.log('llega service')
    return await this._authService.login(body.email, body.password);
  }
}
