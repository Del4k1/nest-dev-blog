import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './comments.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comments') private readonly commentModel: Model<Comment>,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async createComment(
    userId: string,
    postId: string,
    content: string,
  ): Promise<Comment> {
    const createdComment = new this.commentModel({ userId, postId, content });
    return createdComment.save();
  }

  async addComment(commentData: any): Promise<Comment> {
    const createdComment = new this.commentModel(commentData);
    return await createdComment.save();
  }

  async addReply(commentId: string, replyData: any): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new Error('Коментарий не найден!');
    }

    comment.reply.push(replyData);
    return await comment.save();
  }

  async getCommentsForPost(postId: string): Promise<any> {
    const comments = await this.commentModel.find({ postId }).exec();

    const userIdsFromComments = new Set(
      comments
        .map((comment) => [
          comment.userId,
          ...comment.reply.map((it) => it.userId),
        ])
        .flat(1),
    );

    const users = await this.userService.findByUserIds(
      Array.from(userIdsFromComments) as any,
    );

    return { users, comments };
  }

  async toggleLike(commentId: string, userId: string): Promise<any> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new Error('Comment not found');
    }

    const userLikedIndex = comment.likes.findIndex(
      (like) => like.userId === userId,
    );
    if (userLikedIndex === -1) {
      comment.likes.push({ userId });
    } else {
      comment.likes.splice(userLikedIndex, 1);
    }

    return comment.save();
  }
}
