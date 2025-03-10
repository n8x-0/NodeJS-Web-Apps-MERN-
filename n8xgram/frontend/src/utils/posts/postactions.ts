import { PostType } from "../types"

export const handlePostDelete = async (videoId: string, userid: string) => {
    if (!videoId) {
        return
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${userid}/videos/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoId, userid }),
            credentials: "include"
        })
        const data = await response.json()
        if (response.ok) {
            return data
        }
        throw new Error(data.error)
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }
    }
}

export const handlePostEdit = (videoId: string, userid: string) => {
    console.log(videoId, userid);
}

export const uploadVideo = async (data: PostType) => {
    console.log("creating post");
    const post = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/videos/upload`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
    })
    const response = await post.json()
    if (!post.ok) {
        throw new Error(response.message)
    }
}