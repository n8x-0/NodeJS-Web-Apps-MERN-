"use client"
import { sessionCont } from '@/context/session'
import { useContext, useState } from 'react'

const FollowBtn = ({ user, currUserId }: { user: { _id: string, followers: string[], followings: string[] }, currUserId?: string }) => {
    const [followLoading, setFollowLoading] = useState<string | null>(null)
    const session = useContext(sessionCont)

    if(!currUserId){
        currUserId = session?.userSession?._id as string    
    }    

    const handleFollow = async (userId: string) => {
        setFollowLoading(userId)
        try {
            const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${currUserId}/follow/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                cache: "no-store"
            })
            if (req.ok) {
                console.log("user followed");
            }
        } catch (error) {
            console.log(error);
            // setError(error instanceof Error ? error.message : 'Failed to follow user')
        } finally {
            setFollowLoading(null)
        }
    }

    return (
        <button
            onClick={() => user._id !== currUserId && handleFollow(user._id)}
            disabled={user._id !== currUserId ? followLoading === user._id : false}
            className={`px-6 py-[6px] rounded font-medium transition-colors text-sm text-black ${user._id === currUserId && "hidden"} bg-yellow-500 hover:bg-yellow-600 ${followLoading === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}>

            {followLoading === user._id ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin mx-auto" >Unfollow</div>
            ) : user.followers?.includes(currUserId) ? (
                "Unfollow"
            ) : (
                user.followings?.includes(currUserId) && !user.followers.includes(currUserId) ? "Follow Back" : "Follow"
            )}
        </button>
    )
}

export default FollowBtn