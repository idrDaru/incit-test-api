import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RequestCreateUserDto } from './dtos/request-create-user.dto';
import { Response } from 'express';
import { UserService } from './user.service';
import { ResponseProfileDto } from './dtos/response-profile.dto';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { RequestChangePasswordDto } from './dtos/request-change-password.dto';
import { ResponseUserListDto } from './dtos/response-user-list.dto';
import { ResponseStatisticDto } from './dtos/response-statistic.dto';
import { RequestChangeNameDto } from './dtos/request-change-name.dto';
import { RequestCreateUserByGoogleDto } from './dtos/request-create-user-by-google.dto';
import { RequestCreateUserByFacebook } from './dtos/request-create-user-by-facebook.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add')
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createUserDto: RequestCreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.userService.create(createUserDto);
      res.status(201).send();
    } catch (error) {
      if (error.message === 'Email already exists') {
        res.status(409).json({ message: 'Email already exists' }).send();
      } else {
        res.json({ message: 'Internal Server Error' }).send();
      }
    }
  }

  @Post('add/by-google')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUserByGoogle(
    @Body() createUserByGoogleDto: RequestCreateUserByGoogleDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.userService.createUserByGoogle(createUserByGoogleDto);
      res.status(201).send();
    } catch (error) {
      if (error.message === 'Email already exists') {
        res.status(409).json({ message: 'Email already exists' }).send();
      } else {
        res.status(500).json({ message: 'Internal Server Error' }).send();
      }
    }
  }

  @Post('add/by-facebook')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUserByFacebook(
    @Body() createUserByFacebook: RequestCreateUserByFacebook,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.userService.createUserByFacebook(createUserByFacebook);
      res.status(201).send();
    } catch (error) {
      if (error.message === 'Email already exists') {
        res.status(409).json({ message: 'Email already exists' }).send();
      } else {
        res.status(500).json({ message: 'Internal Server Error' }).send();
      }
    }
  }

  @UseGuards(AuthenticationGuard)
  @Get('profile')
  async profile(@Request() req): Promise<ResponseProfileDto> {
    const user = await this.userService.profile(req.user.sub);
    return user;
  }

  @UseGuards(AuthenticationGuard)
  @Put('change-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  async changePassword(
    @Request() req,
    @Res() res: Response,
    @Body() requestChangePasswordDto: RequestChangePasswordDto,
  ): Promise<void> {
    try {
      await this.userService.changePassword(
        req.user.sub,
        requestChangePasswordDto,
      );
      res.status(200).send();
    } catch (error) {
      if (error.message === 'Wrong password') {
        res.status(401).json({ message: error.message }).send();
      } else {
        res.status(500).json({ message: 'Internal Server Error' }).send();
      }
    }
  }

  @UseGuards(AuthenticationGuard)
  @Put('change-name')
  @UsePipes(new ValidationPipe({ transform: true }))
  async changeName(
    @Request() req,
    @Res() res: Response,
    @Body() requestChangeNameDto: RequestChangeNameDto,
  ): Promise<void> {
    try {
      await this.userService.changeName(req.user.sub, requestChangeNameDto);
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ message: error.message }).send();
    }
  }

  @UseGuards(AuthenticationGuard)
  @Get('list')
  async userList(): Promise<ResponseUserListDto[]> {
    return await this.userService.userList();
  }

  @UseGuards(AuthenticationGuard)
  @Get('statistic')
  async statistic(): Promise<ResponseStatisticDto> {
    return await this.userService.statistic();
  }

  @Get('verify/:id')
  async verifyUser(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.userService.verifyUser(id);
      res.redirect(process.env.APP_URL);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' }).send();
    }
  }

  @UseGuards(AuthenticationGuard)
  @Get('resend-verification')
  async resendEmail(@Request() req, @Res() res: Response): Promise<void> {
    try {
      await this.userService.resendEmail(req.user.sub);
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' }).send();
    }
  }
}
