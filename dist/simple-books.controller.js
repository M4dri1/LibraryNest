"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleBooksController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
let SimpleBooksController = class SimpleBooksController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllBooks(page, limit) {
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
        }
        catch (error) {
            console.error('Error in getAllBooks:', error);
            return { error: error.message, books: [], total: 0, page: 1, limit: 5, totalPages: 0 };
        }
    }
    async getCount() {
        const count = await this.prisma.book.count();
        return { count };
    }
    async getPaginatedBooks(page, limit) {
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
    async createBook(bookData) {
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
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async getBook(id) {
        return this.prisma.book.findUnique({
            where: { book_id: parseInt(id) },
            include: { author: true }
        });
    }
};
exports.SimpleBooksController = SimpleBooksController;
__decorate([
    (0, common_1.Get)('books'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SimpleBooksController.prototype, "getAllBooks", null);
__decorate([
    (0, common_1.Get)('books/count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimpleBooksController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)('books/paginated'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SimpleBooksController.prototype, "getPaginatedBooks", null);
__decorate([
    (0, common_1.Post)('books'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SimpleBooksController.prototype, "createBook", null);
__decorate([
    (0, common_1.Get)('books/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SimpleBooksController.prototype, "getBook", null);
exports.SimpleBooksController = SimpleBooksController = __decorate([
    (0, common_1.Controller)('simple'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SimpleBooksController);
