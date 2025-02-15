export interface PostAssets {
    thumbnail: string;
    iframe: string;
    player: string
}

export interface VideoPost {
    videoId: string;
    title: string;
    description: string;
    assets: PostAssets;
    author: {
        _id: string,
        username: string,
        image: string
    }
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

export interface VdoPayload {
    title: string,
    description?: string,
    tags?: string[],
    metadata?: { key: string, value: string }[]
}