import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RequestLoginDto } from './dtos/request-login.dto';
import { Response } from 'express';
import { AuthenticationGuard } from './auth.guard';
import { SignInByGoogleDto } from './dtos/request-login-by-google.dto';
import { AuthService } from './auth.service';
import { SignInByFacebookDto } from './dtos/request-login-by-facebook.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('login')
  async signIn(
    @Body() loginDto: RequestLoginDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const access_token = await this.authService.signIn(loginDto);
      res.status(200).json({ access_token }).send();
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: 'Email not found' }).send();
      } else if (error.message === 'Wrong password') {
        res.status(401).json({ message: error.message }).send();
      } else if (error.message === 'Login with google or facebook') {
        res.status(401).json({ message: 'Login with Google or Facebook' });
      } else {
        res.status(500).json({ message: 'Internal server error' }).send();
      }
    }
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('login/google')
  async signInByGoogle(
    @Body() signInByGoogleDto: SignInByGoogleDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const access_token =
        await this.authService.signInByGoogle(signInByGoogleDto);
      res.status(200).json({ access_token }).send();
    } catch (error) {
      if (error.message === 'Email not found') {
        res.status(404).json({ message: 'Email not found' }).send();
      } else {
        res.status(500).json({ message: 'Internal Server Error' }).send();
      }
    }
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('login/facebook')
  async signInByFacebook(
    @Body() signInByFacebookDto: SignInByFacebookDto,
    @Res() res: Response,
  ) {
    try {
      const access_token =
        await this.authService.signInByFacebook(signInByFacebookDto);
      res.status(200).json({ access_token }).send();
    } catch (error) {
      if (error.message === 'Email not found') {
        res.status(404).json({ message: 'Email not found' }).send();
      } else {
        res.status(500).json({ message: 'Internal Server Error' }).send();
      }
    }
  }

  @UseGuards(AuthenticationGuard)
  @Post('logout')
  async signOut(@Request() req, @Res() res: Response): Promise<void> {
    try {
      const [_, token] = req.headers.authorization?.split(' ') ?? [];
      await this.authService.signOut(token);
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' }).send();
    }
  }
}
