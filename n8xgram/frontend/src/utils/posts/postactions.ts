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
        if(error instanceof Error){
            throw new Error(error.message)
        }
    }
}

export const handlePostEdit = (videoId: string, userid: string) => {
    console.log(videoId, userid);
}

export const uploadVideo = async (formdata: FormData, session: { _id: string, username: string, image: string } | undefined) => {
    const userid = session?._id as string
    const file = formdata.get('file') as File
    const description = formdata.get('description') as string
    let title = formdata.get('title') as string
    const tags = JSON.parse(formdata.get('tags') as string) as string[]

    if (!file) {
        throw new Error("Please Choose a file")
    }
    if (!title) {
        title = file.name;
    }
    if (title.trim().length > 100) {
        throw new Error(`Title must be less than 100 charecters long`)
    }

    const optionalVideoDetails: { description?: string, tags?: string[] } = { description, tags }
    if (!description) delete optionalVideoDetails.description
    if (!tags || tags.length == 0 || tags[0] === '') delete optionalVideoDetails.tags

    const payload = {
        title,
        ...optionalVideoDetails,
        playerId: "pt2OBhuBhqouEklPSIZWmBMP",
        metadata: [
            { key: "authorId", value: userid }
        ]
    }

    const data = new FormData();
    data.append('payload', JSON.stringify(payload));
    data.append('file', file);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${userid}/videos/upload`, {
            method: "POST",
            body: data,
            credentials: "include",
        })
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error as string)
        }
        return response
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            throw new Error(error.message as string)
        }
    }
}