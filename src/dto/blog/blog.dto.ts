import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { BlogMedialUrl } from "src/interface/blog/blog.interface";

export class BlogDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
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

    @ApiProperty()
    deletedCheck: boolean;
}