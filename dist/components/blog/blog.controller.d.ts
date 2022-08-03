/// <reference types="mongoose" />
import { BlogDTO } from 'src/dto/blog/blog.dto';
import { UpdateBlogDTO } from 'src/dto/blog/updateblog.dto';
import { BlogService } from './blog.service';
export declare class BlogController {
    private readonly _blogService;
    constructor(_blogService: BlogService);
    createBlog(blogDto: BlogDTO): Promise<import("mongoose").Document<unknown, any, import("../../interface/blog/blog.interface").BlogInterface> & import("../../interface/blog/blog.interface").BlogInterface & {
        _id: string;
    }>;
    updateBlog(id: string, updateBlogDto: UpdateBlogDTO): Promise<{
        message: string;
    }>;
    deleteBlog(id: string): Promise<{
        message: string;
    }>;
    getBlog(id: string): Promise<import("mongoose").Document<unknown, any, import("../../interface/blog/blog.interface").BlogInterface> & import("../../interface/blog/blog.interface").BlogInterface & {
        _id: string;
    }>;
    getAllBlogs(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
