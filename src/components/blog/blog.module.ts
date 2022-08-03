import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from 'src/schema/blog/blog.schema';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
    imports: [
        MongooseModule.forFeature([
          { name: 'blog', schema: BlogSchema },
        ]),
      ],
      controllers: [BlogController],
      providers: [BlogService],
})
export class BlogModule {}
