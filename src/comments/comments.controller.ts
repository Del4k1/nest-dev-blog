import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post(':postId')
  async addComment(@Body() commentData: any) {
    return await this.commentService.addComment(commentData);
  }

  @Post(':id/reply')
  async addReplyToComment(
    @Param('id') commentId: string,
    @Body() replyData: any,
  ) {
    return await this.commentService.addReply(commentId, replyData);
  }

  @Get(':postId')
  async getCommentsForPost(@Param('postId') postId: string) {
    return this.commentService.getCommentsForPost(postId);
  }

  @Post(':commentId/like/:userId')
  async toggleLike(
    @Param('commentId') commentId: string,
    @Param('userId') userId: string,
  ) {
    return this.commentService.toggleLike(commentId, userId);
  }
}
