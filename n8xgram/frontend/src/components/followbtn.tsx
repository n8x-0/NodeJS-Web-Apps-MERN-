"use client";
import { useContext, useState } from "react";
import { sessionCont } from "@/context/session";
import { UserT } from "@/utils/types";

const FollowBtn = ({ user, currUserId, style }: { user: UserT, currUserId?: string, style: "simple" | "yellow" }) => {
  const session = useContext(sessionCont);

  if (!currUserId) {
    currUserId = session?.userSession?._id as string;
  }

  const [isFollowing, setIsFollowing] = useState(!!user.followers?.includes(currUserId));
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  const handleFollow = async (userId: string) => {
    setFollowLoading(userId);
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/${currUserId}/follow/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-cache",
        }
      );
      if (req.ok) {
        setIsFollowing((prev) => !prev);
        console.log("User follow toggled");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFollowLoading(null);
    }
  };

  if(!currUserId){
    return <></>
  }

  return (
    <button
      onClick={() => user._id !== currUserId && handleFollow(user._id)}
      disabled={user._id !== currUserId ? followLoading === user._id : false}
      className={`px-6 py-[6px] rounded font-medium transition-colors text-sm text-black ${user._id === currUserId && "hidden"
        } ${style === "yellow" ? "bg-yellow-500 hover:bg-yellow-400" : "bg-transparent text-yellow-400 underline underline-offset-4 hover:text-yellow-300"}  ${followLoading === user._id ? "opacity-50 cursor-not-allowed" : ""
        }`}
    >
      {followLoading === user._id ? (
        <div className="w-5 h-5 border border-yellow-600 border-t-yellow-200 rounded-full animate-spin mx-auto"></div>
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </button>
  );
};

export default FollowBtn;
