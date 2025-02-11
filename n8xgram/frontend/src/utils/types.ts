export interface PostAssets {
    thumbnail: string;
    iframe: string;
}

export interface VideoPost {
    assets: PostAssets;
}

export interface UserT {
    _id: string;
    username: string;
    image: string;
    email?: string
    createdAt?: string;
    posts?: VideoPost[];
    followers?: string[]; 
    followings?: string[]; 
}