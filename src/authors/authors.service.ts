import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto) {
    return this.prisma.author.create({
      data: createAuthorDto,
    });
  }

  async findAll(page?: number, limit?: number): Promise<any> {
    if (page !== undefined && limit !== undefined && page > 0 && limit > 0) {
      const offset = (page - 1) * limit;
      
      const [authors, total] = await Promise.all([
        this.prisma.author.findMany({
          skip: offset,
          take: limit,
          orderBy: { created_at: 'desc' }
        }),
        this.prisma.author.count(),
      ]);
      
      return {
        authors,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      };
    }

    return this.prisma.author.findMany({ 
      orderBy: { created_at: 'desc' } 
    });
  }

  async findOne(id: number) {
    return this.prisma.author.findUnique({ 
      where: { author_id: id } 
    });
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return this.prisma.author.update({
      where: { author_id: id },
      data: updateAuthorDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.author.delete({
      where: { author_id: id },
    });
  }

  async count(): Promise<number> {
    return this.prisma.author.count();
  }

  async updatePhoto(id: number, photo: string): Promise<void> {
    await this.prisma.author.update({
      where: { author_id: id },
      data: { photo },
    });
  }
}
