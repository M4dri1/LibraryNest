"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const express_session_1 = __importDefault(require("express-session"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false, // Allow extra properties for frontend compatibility
        transform: true,
        skipMissingProperties: false,
    }));
    // CORS configuration
    app.enableCors({
        origin: true,
        credentials: true,
    });
    // Session configuration
    app.use((0, express_session_1.default)({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    }));
    // Static files configuration
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'FRONTEND', 'react-dist'));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'FRONTEND', 'uploads'), {
        prefix: '/api/uploads/',
    });
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
