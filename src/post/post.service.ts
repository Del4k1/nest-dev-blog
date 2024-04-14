import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAggregatePostsWithUserInfo, IPost } from '../interface/IPost';
import { Post } from './post.model';

@Injectable()
export class PostService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async createPost(createPost: IPost, userId: string): Promise<IPost> {
    createPost.userId = userId;
    const newPost = await this.postModel.create(createPost);
    return newPost.save();
  }

  async updatePost(postId: string, updatePost: IPost): Promise<IPost> {
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      { ...updatePost },
      { new: true },
    );
    return updatedPost;
  }

  async getAllPosts(): Promise<IPost[]> {
    return this.postModel.find({ isActive: true }).exec();
  }

  async getDetailPost(postId: string): Promise<IPost> {
    return this.postModel.findById(postId);
  }

  async undeletePost(postId: string): Promise<IPost> {
    const post = await this.postModel.findById(postId);

    post.isActive = false;

    return await post.save();
  }

  async aggregatePostsWithUserInfo(
    userId: string,
  ): Promise<IAggregatePostsWithUserInfo[]> {
    return this.postModel
      .aggregate([
        {
          $match: {
            userId: { $eq: userId },
            isActive: { $eq: true },
          },
        },
        {
          $addFields: {
            userId: {
              $toObjectId: '$userId',
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',

            pipeline: [
              {
                $project: {
                  username: 1,
                  image: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            title: 1,
            content: 1,
            createdAt: 1,
            isActive: 1,
            user: {
              $arrayElemAt: ['$user', 0],
            },
          },
        },
      ])
      .exec();
  }

  async likePost(like: any): Promise<Post> {
    const post = await this.postModel.findById({ _id: like.postId });

    if (!post) {
      throw new Error('Post not found');
    }

    if (like.type === 'thumbUp') {
      const indexThumbDown = post.thumbDown.indexOf(like.userId);
      if (indexThumbDown !== -1) {
        post.thumbDown.splice(indexThumbDown, 1);
      }
    } else if (like.type === 'thumbDown') {
      const indexThumbUp = post.thumbUp.indexOf(like.userId);
      if (indexThumbUp !== -1) {
        post.thumbUp.splice(indexThumbUp, 1);
      }
    }

    const index = post[like.type].indexOf(like.userId);
    if (index !== -1) {
      post[like.type].splice(index, 1);
    } else {
      post[like.type].push(like.userId);
    }

    await post.save();
    return post;
  }
}
