export interface BlogMedialUrl {
    type: string;
    captureFileURL: string;
    path: string;
    thumbnailURL: string;
    thumbnailPath: string;
    blurHash: string;
    backgroundColorHex: string;
}
export interface BlogInterface {
    _id: string;
    title: string;
    text: string;
    media: BlogMedialUrl[];
    deletedCheck: boolean;
}
