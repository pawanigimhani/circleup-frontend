
export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
    image?: string | null;
    comments: Comment[];
    feed: FeedImage[];
    likedFeedImages: FeedImage[];
    likedFeedImagesIds: string[];
    savedFeedImages: FeedImage[];
    savedFeedImagesIds: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Comment {
    id: string;
    text: string;
    user: User;
    userId: string;
    feed: FeedImage;
    feedId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface FeedImage {
    id: string;
    user: User;
    userId: string;
    imageUrl: string;
    likes: User[];
    likedUserIds: string[];
    saves: User[];
    savedUserIds: string[];
    likeCount: number;
    saveCount: number;
    caption?: string | null;
    comments: Comment[];
    createdAt: Date;
    updatedAt: Date;
  }
  