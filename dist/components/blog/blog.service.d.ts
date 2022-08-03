import { Model } from 'mongoose';
import { BlogInterface } from 'src/interface/blog/blog.interface';
export declare class BlogService {
    private readonly _blogModel;
    constructor(_blogModel: Model<BlogInterface>);
    createBlog(blogDto: any): Promise<import("mongoose").Document<unknown, any, BlogInterface> & BlogInterface & {
        _id: string;
    }>;
    updateBlog(id: any, updateBlogDto: any): Promise<{
        message: string;
    }>;
    deleteBlog(id: any): Promise<{
        message: string;
    }>;
    getBlog(id: any): Promise<import("mongoose").Document<unknown, any, BlogInterface> & BlogInterface & {
        _id: string;
    }>;
    getAllBlogs(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
