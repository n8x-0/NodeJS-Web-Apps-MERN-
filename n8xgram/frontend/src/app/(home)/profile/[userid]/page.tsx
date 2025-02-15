"use client";

import { useContext, useEffect, useState } from "react";
import { Camera, EllipsisVertical, Grid, Heart, Pencil, Send, Settings, Trash2, X } from "lucide-react";
import Image from "next/image";
import Uploadpicbtn from "@/components/profile/uploadpicbtn";
import { useParams, useRouter } from "next/navigation";
import LoadingProfile from "@/components/profile/loadingProfile";
import { sessionCont } from "@/context/session";
import { UserT, VideoPost } from "@/utils/types";
import { handlePostDelete, handlePostEdit } from "@/utils/posts/postactions";
import Link from "next/link";

const UserProfileClient = () => {
  const router = useRouter();
  const { userid } = useParams();
  const [userdata, setUserdata] = useState<UserT | null>(null);
  const [userPosts, setUsersPosts] = useState<VideoPost[] | null>(null);
  const [selectedPost, setSelectedPost] = useState<VideoPost | null>(null);
  const [togglePostActions, setTogglePostActions] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const session = useContext(sessionCont);

  const fetchData = async () => {
    try {
      const user = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/${userid}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-cache",
        }
      );
      if (user.status === 401) {
        router.push("/register");
        return;
      }
      if (!user.ok) {
        throw new Error("Network response was not ok");
      }
      session?.getUserSession();
      const data = await user.json();
      setUserdata(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: 1, userid }),
        credentials: "include"
      });
      const data = await req.json();
      if (req.ok) {
        setUsersPosts(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchData();
  }, [userid]);

  if (!userdata) {
    return <LoadingProfile />;
  }

  return (
    <div className="max-w-3xl mx-auto p-3 flex-1">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
        <Uploadpicbtn userid={userid as string} userData={userdata} />
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl font-semibold">{userdata.username}</h1>
            <Link href={`/profile/${userid}/editprofile`} className="px-4 py-1 bg-gray-100 rounded-md text-sm font-medium text-black">
              Edit Profile
            </Link>
            <Settings size={24} className="text-gray-600" />
          </div>

          <div className="flex gap-6 mb-4">
            <div className="text-center">
              <span className="font-semibold">{userdata.posts?.length}</span>
              <p className="text-sm text-gray-600">posts</p>
            </div>
            <div className="text-center">
              <span className="font-semibold">{userdata.followers?.length}</span>
              <p className="text-sm text-gray-600">followers</p>
            </div>
            <div className="text-center">
              <span className="font-semibold">{userdata.followings?.length}</span>
              <p className="text-sm text-gray-600">following</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-medium">{userdata.username}</p>
            <p className="text-sm text-gray-600">
              Joined {new Date(userdata.createdAt!).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-center gap-12 mb-4">
          <button className="flex items-center gap-2 text-yellow-500">
            <Grid size={20} />
            <span className="text-sm font-medium">POSTS</span>
          </button>
        </div>

        {!userPosts ? (
          <div className="text-center py-12">
            <Camera size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Share Photos</h2>
            <p className="text-gray-600">
              When you share photos, they will appear on your profile.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {userPosts &&
              userPosts.map((post: VideoPost, index: number) => {
                return (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    {!post.assets.thumbnail ?
                      <div className="w-full h-full bg-zinc-600 animate-pulse"></div>
                      :
                      <Image
                        src={post.assets.thumbnail}
                        alt="userpost"
                        width={800}
                        height={800}
                        className="w-full h-full object-cover"
                        priority
                      />
                    }
                  </div>
                )
              }
              )}
          </div>
        )}
      </div>

      {/* popup */}

      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative bg-black p-4 rounded-lg shadow-xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-7 left-7 text-white text-xl"
              onClick={() => setSelectedPost(null)}
            >
              <X />
            </button>

            <div key={selectedPost.videoId} className="sm:w-[520px] w-full h-fit">
              <div className="justify-end p-3 border-zinc-700 border rounded-t-2xl flex items-center gap-2 text-sm w-full">
                <div className="group relative w-fit">
                  <EllipsisVertical
                    className="cursor-pointer hover:text-yellow-500 transition-colors duration-200"
                    onClick={() => {
                      if (togglePostActions) {
                        setTogglePostActions(false)
                      } else {
                        setTogglePostActions(true)
                      }
                    }}
                  />
                  <div className={`${togglePostActions ? "block" : "hidden"}`}>
                    <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-zinc-800/90 backdrop-blur-sm border border-zinc-700/50 shadow-xl transform transition-all duration-200 ease-out scale-95 group-hover:scale-100">
                      <div className="p-1.5">
                        <button
                          onClick={() => handlePostEdit(selectedPost.videoId, userid as string)}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-yellow-500 hover:bg-zinc-700/50 rounded-lg transition-all duration-200"
                        >
                          <Pencil className="w-4 h-4 mr-3" />
                          Edit video
                        </button>
                        <button
                          onClick={async () => {
                            setLoadingDelete(true)
                            try {
                              const res = await handlePostDelete(selectedPost.videoId, userid as string)
                              if (res) {
                                setSelectedPost(null)
                                setLoadingDelete(false)
                              }
                            } catch (error) {
                              console.log(error);
                              setLoadingDelete(false)
                            }
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        >
                          {loadingDelete ?
                            <div className="w-4 h-4 rounded-full border border-red-500 border-t-red-400 animate-spin mx-auto"></div>
                            :
                            <>
                              <Trash2 className="w-4 h-4 mr-3" />
                              Delete video
                            </>
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </div>              </div>
              <div className="pb-2 border-zinc-700 border rounded-xl rounded-t-none">
                <div className="w-full sm:h-[500px] h-[400px] bg-zinc-600">
                  <iframe
                    src={selectedPost.assets.player}
                    width="100%"
                    height="100%"
                    allowFullScreen
                  />
                </div>
                <div className="py-1 px-3 border-t border-zinc-500">
                  <div className="flex items-center gap-3 py-2">
                    <Heart />
                    <Send />
                  </div>
                  <div className="font-medium">{selectedPost.title}</div>
                  <p className="text-sm">{selectedPost.description}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileClient;