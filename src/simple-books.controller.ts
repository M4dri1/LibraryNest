import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller('simple')
export class SimpleBooksController {
  constructor(private prisma: PrismaService) {}

  @Get('books')
  async getAllBooks(@Query('page') page?: string, @Query('limit') limit?: string) {
    try {
      const pageNum = page ? parseInt(page) : 1;
      const limitNum = limit ? parseInt(limit) : 5;
      const offset = (pageNum - 1) * limitNum;

      const [books, total] = await Promise.all([
        this.prisma.book.findMany({
          skip: offset,
          take: limitNum,
          include: { author: true },
          orderBy: { book_id: 'asc' }
        }),
        this.prisma.book.count()
      ]);

      const transformedBooks = books.map(book => ({
        book_id: book.book_id,
        title: book.title,
        description: book.description,
        photo: book.photo,
        created_at: book.created_at,
        author_name: book.author.name_author,
        author_id: book.author.author_id
      }));

      return {
        books: transformedBooks,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      };
    } catch (error) {
      console.error('Error in getAllBooks:', error);
      return { error: error.message, books: [], total: 0, page: 1, limit: 5, totalPages: 0 };
    }
  }

  @Get('books/count')
  async getCount() {
    const count = await this.prisma.book.count();
    return { count };
  }

  @Get('books/paginated')
  async getPaginatedBooks(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 5;
    const offset = (pageNum - 1) * limitNum;

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        skip: offset,
        take: limitNum,
        include: { author: true },
        orderBy: { book_id: 'asc' }
      }),
      this.prisma.book.count()
    ]);

    const transformedBooks = books.map(book => ({
      book_id: book.book_id,
      title: book.title,
      description: book.description,
      photo: book.photo,
      created_at: book.created_at,
      author_name: book.author.name_author,
      author_id: book.author.author_id
    }));

    return {
      books: transformedBooks,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    };
  }

  @Post('books')
  async createBook(@Body() bookData: any) {
    try {
      const book = await this.prisma.book.create({
        data: {
          title: bookData.title,
          description: bookData.description,
          author_id: bookData.author_id
        },
        include: { author: true }
      });
      return { success: true, book };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('books/:id')
  async getBook(@Param('id') id: string) {
    return this.prisma.book.findUnique({
      where: { book_id: parseInt(id) },
      include: { author: true }
    });
  }
}
