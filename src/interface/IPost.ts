export interface IPost {
  _id?: string;
  title: string;
  content: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  like: string[];
  thumbUp: string[];
  thumbDown: string[];
  fire: string[];
}

export interface ISavePost {
  userId: string;
  postId: string;
}

export interface IAggregatePostsWithUserInfo {
  title: string;
  content: string;
  createdAt: Date;
  isActive: boolean;

  user: {
    username: string;
    image: string;
  };
}
