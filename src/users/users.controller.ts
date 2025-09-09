import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users/favorite')
  async getFavoriteBook(@Request() req) {
    const username = req.query.username || req.user.username;
    return this.usersService.getFavoriteBook(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/users/favorite')
  async getFavoriteBookApi(@Request() req) {
    const username = req.query.username || req.user.username;
    return this.usersService.getFavoriteBook(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorite/:id')
  async addToFavorites(@Param('id') bookId: string, @Request() req) {
    await this.usersService.updateFavoriteBook(req.user.username, +bookId);
    return { message: 'Book added to favorites' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/favorite/:id')
  async addToFavoritesApi(@Param('id') bookId: string, @Request() req) {
    await this.usersService.updateFavoriteBook(req.user.username, +bookId);
    return { message: 'Book added to favorites' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  @UseInterceptors(FileInterceptor('profile_image'))
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.profile_image = file.filename;
    }
    
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/update-profile')
  @UseInterceptors(FileInterceptor('profile_image'))
  async updateProfileApi(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.profile_image = file.filename;
    }
    
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-profile')
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/get-profile')
  async getProfileApi(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }
}
