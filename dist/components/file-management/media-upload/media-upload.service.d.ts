export declare class MediaUploadService {
    getDominantColor(imageUrl: any): Promise<{
        hexCode: string;
    }>;
    compressImageTo300(file: any): Promise<string>;
}
