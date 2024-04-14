import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SavePost } from './save-post.model';
import { ISavePost } from 'src/interface/IPost';
import { SavePostDto } from './save-post.dto';

@Injectable()
export class SavePostService {
  constructor(
    @InjectModel('SavePosts') private readonly savePostModel: Model<SavePost>,
  ) {}

  async savePost(savePostDto: SavePostDto): Promise<ISavePost> {
    const { userId, postId } = savePostDto;
    const newSavePost = new this.savePostModel({ userId, postId });
    return newSavePost.save();
  }

  async deletePost(postId: string): Promise<void> {
    return this.savePostModel.findByIdAndDelete(postId);
  }

  async getSavedPostsByUserId(userId: string): Promise<any[]> {
    return this.savePostModel
      .aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $addFields: {
            postId: {
              $toObjectId: '$postId',
            },
          },
        },
        {
          $lookup: {
            from: 'posts',
            localField: 'postId',
            foreignField: '_id',
            as: 'savedPosts',
          },
        },
        {
          $match: {
            'savedPosts.isActive': { $eq: true },
          },
        },
      ])
      .exec();
  }
}
