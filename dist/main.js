"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    const config = new swagger_1.DocumentBuilder()
        .setBasePath('api/v1/en')
        .setTitle('DiviDeals')
        .setDescription('DiviDeals APIs')
        .setVersion('1.0')
        .addTag('DiviDeals APIs')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('swagger', app, document);
    const port = 5200;
    await app.listen(port);
    console.warn(`API is running on ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map