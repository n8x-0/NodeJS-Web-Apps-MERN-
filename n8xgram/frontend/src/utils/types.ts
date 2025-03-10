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
    author: UserT;
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

export type CloudinaryUploadResponse = {
    secure_url: string,
    thumbnail_url: string,
    original_filename: string,
    height: number,
    width: number,
    resource_type: string,
    format: string,
    bytes: number
}

export type PostType = CloudinaryUploadResponse & {title: String, description: String, tags: string}


export interface VideoPost {
    _id: string;
    title: string;
    description: string;
    original_filename: string;
    secure_url: string;
    thumbnail_url: string;
    bytes: number;
    format: string;
    height: number;
    width: number;
    resource_type: string;
    likes: string[];
    comments: string[];
    author: UserT;
}