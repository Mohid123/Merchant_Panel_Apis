import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { BlogMedialUrl } from "src/interface/blog/blog.interface";

export class UpdateBlogDTO {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    text: string;

    @ApiProperty({
        example: [
          {
            type: '',
            captureFileURL: '',
            path: '',
            thumbnailURL: '',
            thumbnailPath: '',
            blurHash:'',
            backgroundColorHex:'',
          }
        ]
    })
    media: BlogMedialUrl[]
}