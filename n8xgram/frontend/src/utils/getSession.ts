export const getSession = async () => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/session/getsession`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
        const data = await req.json()
        if(data){
            return data
        }else{
            throw new Error("Error getting user session")
        }
    } catch (error) {
        if(error instanceof Error){
            console.log(error);
            throw new Error(error.message as string)
        }
    }
}