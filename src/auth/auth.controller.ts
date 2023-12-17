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
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RequestLoginDto } from './dtos/request-login.dto';
import { Response } from 'express';
import { AuthenticationGuard } from './auth.guard';
import { SessionService } from 'src/session/session.service';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('login')
  async signIn(
    @Body() loginDto: RequestLoginDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const user = await this.userService.validateUser(loginDto);
      const payload = { sub: user.id };
      const access_token = await this.jwtService.signAsync(payload);
      await this.sessionService.login(user, access_token);
      res.status(200).json({ access_token }).send();
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: 'Email not found' }).send();
      } else if (error.message === 'Wrong password') {
        res.status(401).json({ message: error.message }).send();
      } else {
        res.status(500).json({ message: 'Internal server error' }).send();
      }
    }
  }

  @UseGuards(AuthenticationGuard)
  @Post('logout')
  async signOut(@Request() req, @Res() res: Response): Promise<void> {
    try {
      const [_, token] = req.headers.authorization?.split(' ') ?? [];
      await this.sessionService.logout(token);
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' }).send();
    }
  }
}
