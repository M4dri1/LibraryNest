import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { diskStorage } from 'multer';

import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { SimpleBooksController } from './simple-books.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'FRONTEND', 'react-dist'),
      exclude: ['/api*'],
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', 'FRONTEND', 'uploads'),
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
    BooksModule,
    AuthorsModule,
    UsersModule,
    LoansModule,
    ReviewsModule,
    AuthModule,
  ],
  controllers: [SimpleBooksController],
})
export class AppModule {}
