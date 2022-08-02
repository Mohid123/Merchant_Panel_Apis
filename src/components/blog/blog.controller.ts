import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogDTO } from 'src/dto/blog/blog.dto';
import { UpdateBlogDTO } from 'src/dto/blog/updateblog.dto';
import { BlogService } from './blog.service';

@ApiTags('Blogs')
@Controller('blog')
export class BlogController {
    constructor(private readonly _blogService:BlogService) {}

    @Post('createBlog')
    createBlog (@Body() blogDto:BlogDTO) {
        return this._blogService.createBlog(blogDto)
    }

    @Post('updateBlog/:id')
    updateBlog (
        @Param('id') id: string,
        @Body() updateBlogDto:UpdateBlogDTO) {
        return this._blogService.updateBlog(id, updateBlogDto)
    }

    @Post('deleteBlog/:id')
    deleteBlog (@Param('id') id: string) {
        return this._blogService.deleteBlog(id)
    }

    @Get('getBlog/:id')
    getBlog (@Param('id') id: string) {
        return this._blogService.getBlog(id);
    }

    @Get('getAllBlogs')
    getAllBlogs (
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10,
    ) {
        return this._blogService.getAllBlogs(offset, limit)
    }
}
