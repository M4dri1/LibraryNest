import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller()
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get('authors/count')
  async count() {
    const count = await this.authorsService.count();
    return { count };
  }

  @Get('api/authors/count')
  async countApi() {
    const count = await this.authorsService.count();
    return { count };
  }

  @Get('authors/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const acceptHeader = res.req.headers.accept || '';
    
    if (acceptHeader.includes('text/html')) {
      return res.sendFile(join(__dirname, '..', '..', 'FRONTEND', 'react-dist', 'index.html'));
    } else {
      const author = await this.authorsService.findOne(+id);
      return res.json(author);
    }
  }

  @Get('api/authors/:id')
  async findOneApi(@Param('id') id: string) {
    return this.authorsService.findOne(+id);
  }

  @Get('authors')
  async findAll(@Res() res: Response) {
    const acceptHeader = res.req.headers.accept || '';
    
    if (acceptHeader.includes('text/html')) {
      return res.sendFile(join(__dirname, '..', '..', 'FRONTEND', 'react-dist', 'index.html'));
    } else {
      const authors = await this.authorsService.findAll();
      return res.json(authors);
    }
  }

  @Get('api/authors')
  async findAllApi(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? Number(page) : undefined;
    const limitNum = limit ? Number(limit) : undefined;
    
    return this.authorsService.findAll(pageNum, limitNum);
  }

  @Post('authors')
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Post('api/authors')
  async createApi(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Patch('authors/:id')
  async update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(+id, updateAuthorDto);
  }

  @Patch('api/authors/:id')
  async updateApi(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(+id, updateAuthorDto);
  }

  @Delete('authors/:id')
  async remove(@Param('id') id: string) {
    await this.authorsService.remove(+id);
    return { message: 'Author deleted successfully' };
  }

  @Delete('api/authors/:id')
  async removeApi(@Param('id') id: string) {
    await this.authorsService.remove(+id);
    return { message: 'Author deleted successfully' };
  }

  @Post('authors/:id/image')
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    await this.authorsService.updatePhoto(+id, file.filename);
    return { photo: file.filename };
  }

  @Post('api/authors/:id/image')
  @UseInterceptors(FileInterceptor('file'))
  async updateImageApi(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    await this.authorsService.updatePhoto(+id, file.filename);
    return { photo: file.filename };
  }
}
