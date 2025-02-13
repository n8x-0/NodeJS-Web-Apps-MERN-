export const handlePostDelete = async (videoId: string, userid: string) => {
    if(!videoId){
        return
    }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${userid}/videos/delete`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({videoId}),
            credentials: "include"
        })
        const data = await res.json()
        if(!res.ok){
            throw new Error(data.error)
        }
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

export const handlePostEdit = (videoId: string, userid: string) => {
    console.log(videoId, userid);
}