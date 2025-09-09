import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ 
      where: { id } 
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ 
      where: { username } 
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async updateFavoriteBook(username: string, bookId: number): Promise<void> {
    await this.prisma.user.update({
      where: { username },
      data: { favorite_book_id: bookId },
    });
  }

  async getFavoriteBook(username: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        favorite_book_id: true,
      },
    });

    if (!user?.favorite_book_id) {
      return null;
    }

    const book = await this.prisma.book.findUnique({
      where: { book_id: user.favorite_book_id },
      include: {
        author: true,
      },
    });

    if (!book) return null;

    return {
      book_id: book.book_id,
      title: book.title,
      description: book.description,
      photo: book.photo,
      author_name: book.author.name_author,
    };
  }
}
