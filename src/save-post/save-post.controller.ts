import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SavePostService } from './save-post.service';
import { ISavePost } from 'src/interface/IPost';
import { SavePostDto } from './save-post.dto';

@Controller('save-post')
export class SavePostController {
  constructor(private readonly savePostService: SavePostService) {}

  @Get(':userId')
  async getSavedPostsByUserId(@Param('userId') userId: string): Promise<any[]> {
    return this.savePostService.getSavedPostsByUserId(userId);
  }

  @Post()
  savePost(@Body() savePostDto: SavePostDto): Promise<ISavePost> {
    return this.savePostService.savePost(savePostDto);
  }

  @Delete(':postId')
  async deletePost(@Param('postId') postId: string): Promise<void> {
    return this.savePostService.deletePost(postId);
  }
}
