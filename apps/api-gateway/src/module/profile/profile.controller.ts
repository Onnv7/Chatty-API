import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetUserProfileResponsePayload,
  SearchProfileResponsePayload,
} from './payload/profile.response';
import { ResponseAPI } from '../../common/model/response-api';
import { ResponseMessage } from '../../../../../libs/shared/src';
import { JwtGuard } from '../../common/auth/jwt.guard';
import { UpdateProfileRequestPayload } from './payload/profile.request';

@ApiTags('PROFILE')
@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: ProfileService) {}

  @Get('/search')
  async searchProfile(
    @Query('email') email: string,
  ): Promise<ResponseAPI<SearchProfileResponsePayload>> {
    const data = await this.userService.searchProfile(email);
    return { data, message: ResponseMessage.GET };
  }

  @Get('/user/:userId')
  async getUserProfile(
    @Param('userId') userId: number,
  ): Promise<ResponseAPI<GetUserProfileResponsePayload>> {
    const data = await this.userService.getUserProfile(userId);
    return { data, message: ResponseMessage.GET };
  }

  @Put('/user/:userId')
  async updateProfile(
    @Param('userId') userId: number,
    @Body() body: UpdateProfileRequestPayload,
  ): Promise<ResponseAPI<void>> {
    const data = await this.userService.updateProfile(userId, body);
    return { message: ResponseMessage.UPDATE };
  }
}
