import { Module } from '@nestjs/common';
import { SavePostService } from './save-post.service';
import { SavePostController } from './save-post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SavePostSchema } from './save-post.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'SavePosts', schema: SavePostSchema }]),
  ],
  controllers: [SavePostController],
  providers: [SavePostService],
})
export class SavePostModule {}
