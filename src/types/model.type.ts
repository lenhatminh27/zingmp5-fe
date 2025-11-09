export interface IRole {
    _id: string;
    name: string;
}

export interface IAccount {
    _id: string;
    created_by?: string;
    created_date?: string;
    last_modified_by?: string;
    last_modified_date?: string;
    active?: boolean;
    avatar?: string;
    email: string;
    // password_hash không trả về FE
    roles: Array<string | IRole>; // BE có nơi trả name string[], có nơi trả role object
}

export interface IAlbum {
    _id: string;
    created_by?: string;          // Account _id
    last_modified_by?: string;    // Account _id
    image?: string;
    slug: string;
    status?: string;
    title: string;
    artist: string[];             // Artist ids
    songs: string[];              // Song ids
    createdAt?: string;
    updatedAt?: string;
}

export interface IArtist {
    _id: string;
    userId: string;               // ref "User"
    stageName: string;
    bio?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    location?: string;
    genreFocus?: string[];        // Genre ids
    socialLinks?: {
        instagram?: string;
        youtube?: string;
        facebook?: string;
        tiktok?: string;
    };
    isVerified?: boolean;
    followerCount?: number;
    followingCount?: number;
    songs?: string[];             // Song ids
    albums?: string[];            // Album ids
    createdAt?: string;
    updatedAt?: string;
}

export interface IGenre {
    _id: string;
    thumbnail?: string;
    name: string;
    slug: string;
    description?: string;
    songs: string[];              // Song ids
    createdAt?: string;
    updatedAt?: string;
}

export interface ISong {
    _id: string;
    created_by?: string;
    created_date?: string;
    last_modified_by?: string;
    last_modified_date?: string;

    duration: number;
    file_path?: string;           // media url
    image?: string;               // cover url
    lyric?: string;
    policy?: string;
    slug: string;
    title: string;

    album_id?: string;            // Album id
    artists: string[];            // Artist ids
    genres: string[];             // Genre ids
    likes?: number;
    views?: number;
    liked_by?: string[];          // Account ids
}

export interface IComment {
    _id: string;
    created_by?: string;          // user id (string)
    created_date?: string;
    last_modified_by?: string;
    last_modified_date?: string;

    content: string;
    account_id: string;           // Account id
    song_id: string;              // Song id
    replies?: string[];           // Comment ids
    parent_id?: string;           // Comment id
}

export interface ISongStats {
    id: string;
    title: string;
    likes: number;
    views: number;
    likedByCount: number;
}
