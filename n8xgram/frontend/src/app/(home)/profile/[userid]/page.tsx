"use client";

import { useContext, useEffect, useState } from "react";
import { Camera, Grid, Settings, X } from "lucide-react";
import Image from "next/image";
import Uploadpicbtn from "@/components/profile/uploadpicbtn";
import { useParams, useRouter } from "next/navigation";
import LoadingProfile from "@/components/profile/loadingProfile";
import { sessionCont } from "@/context/session";
import { UserT, VideoPost } from "@/utils/types";

const UserProfileClient = () => {
  const router = useRouter();
  const { userid } = useParams();
  const [userdata, setUserdata] = useState<UserT | null>(null);
  const [userPosts, setUsersPosts] = useState<VideoPost[] | null>(null);
  const [selectedPost, setSelectedPost] = useState<VideoPost | null>(null);
  const session = useContext(sessionCont);

  const fetchData = async () => {
    try {
      const user = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/${userid}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
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
      });
      const data = await req.json();
      if (req.ok) {
        console.log(data.data);
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
        <div className="relative">
          <Image
            width={600}
            height={600}
            src={userdata.image}
            alt={userdata.username}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
          />
          <button className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full text-white">
            <Uploadpicbtn userid={userid as string} />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl font-semibold">{userdata.username}</h1>
            <button className="px-4 py-1 bg-gray-100 rounded-md text-sm font-medium text-black">
              Edit Profile
            </button>
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

        {userdata.posts?.length === 0 ? (
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
              userPosts.map((post: VideoPost, index: number) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <Image
                    src={post.assets.thumbnail}
                    alt="userpost"
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* popup */}

      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative bg-white p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 -right-10 text-white font-bold"
              onClick={() => setSelectedPost(null)}
            >
              <X/>
            </button>
            <div
              className="sm:w-[560px] sm:h-[315px] w-full"
              dangerouslySetInnerHTML={{
                __html: selectedPost.assets.iframe,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileClient;