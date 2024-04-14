import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IAggregatePostsWithUserInfo, IPost } from '../interface/IPost';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPosts(): Promise<IPost[]> {
    return this.postService.getAllPosts();
  }

  @Get('detail/:postId')
  getDetailPost(@Param('postId') postId: string): Promise<IPost> {
    return this.postService.getDetailPost(postId);
  }

  @Get(':userId')
  async aggregatePostsWithUserInfo(
    @Param('userId') userId: string,
  ): Promise<IAggregatePostsWithUserInfo[]> {
    return this.postService.aggregatePostsWithUserInfo(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() postData: IPost, @Req() req): Promise<IPost> {
    const userId = req.user.id;
    const postId = postData._id;

    if (postId) {
      return this.postService.updatePost(postId, postData);
    } else {
      return this.postService.createPost(postData, userId);
    }
  }

  @Put(':postId/update')
  async updatePost(
    @Param('postId') postId: string,
    @Body() updateData: IPost,
  ): Promise<IPost> {
    return this.postService.updatePost(postId, updateData);
  }

  @Put(':postId/active')
  @UseGuards(JwtAuthGuard)
  async undeletePost(@Param('postId') postId: string): Promise<void> {
    await this.postService.undeletePost(postId);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<void> {
    console.log('Files:', files);
  }

  @Post('like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Body() likes: any): Promise<IPost> {
    console.log(likes);
    return this.postService.likePost(likes);
  }
}
