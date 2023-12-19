import { SessionService } from 'src/session/session.service';
import { RequestLoginDto } from './dtos/request-login.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInByGoogleDto } from './dtos/request-login-by-google.dto';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from 'src/user/user.service';
import { Injectable } from '@nestjs/common';
import { SignInByFacebookDto } from './dtos/request-login-by-facebook.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async signIn(loginDto: RequestLoginDto): Promise<string> {
    try {
      const user = await this.userService.validateUser(loginDto);
      const payload = { sub: user.id };
      const access_token = await this.jwtService.signAsync(payload);
      await this.sessionService.login(user, access_token);
      return access_token;
    } catch (error) {
      throw error;
    }
  }

  async signInByGoogle(signInByGoogleDto: SignInByGoogleDto): Promise<string> {
    try {
      const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID);
      const tokenInfo = await oAuth2Client.verifyIdToken({
        idToken: signInByGoogleDto.credential,
        audience: process.env.CLIENT_ID,
      });

      const { email } = tokenInfo.getPayload();

      const user = await this.userService.findByEmail(email);

      if (!user) throw 'Email not found';

      const payload = { sub: user.id };
      const access_token = await this.jwtService.signAsync(payload);
      await this.sessionService.login(user, access_token);
      return access_token;
    } catch (error) {
      throw new Error(error);
    }
  }

  async signInByFacebook(
    signInByFacebookDto: SignInByFacebookDto,
  ): Promise<string> {
    try {
      const user = await this.userService.findByEmail(
        signInByFacebookDto.email,
      );

      if (!user) throw 'Email not found';
      const payload = { sub: user.id };
      const access_token = await this.jwtService.signAsync(payload);
      await this.sessionService.login(user, access_token);
      return access_token;
    } catch (error) {
      throw new Error(error);
    }
  }

  async signOut(token: any): Promise<void> {
    try {
      await this.sessionService.logout(token);
    } catch (error) {
      throw new Error(error);
    }
  }
}
