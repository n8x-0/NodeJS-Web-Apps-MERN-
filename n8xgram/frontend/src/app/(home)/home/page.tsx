"use client";

import FollowBtn from '@/components/followbtn';
import { AuthSessionContext } from '@/context/authSession';
import { VideoPost } from '@/utils/types';
import { Camera, ChevronLeft, ChevronRight, Heart, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

interface videosResponseObj {
  posts: VideoPost[],
  currentPage: number,
  totalPages: number,
  totalCount: number
}

const HomePage = () => {
  const { session, loading } = useContext(AuthSessionContext) as { session: { _id: string } | null, loading: boolean }
  const router = useRouter()

  useEffect(() => {
    if (!loading && session === null) {
      router.push('/')
    }
  }, [session])

  const [data, setData] = useState<videosResponseObj>();
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/videos`, {
        method: "POST",
        body: JSON.stringify({ page: currentPage, limit: 10 }),
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      if (!req.ok) throw new Error("Failed to fetch videos.");
      const result = await req.json();
      console.log(result);

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <div className="max-w-3xl mx-auto p-3 flex-1 max-h-[90vh] overflow-auto hideScrollbar">
      <div className="w-full flex justify-center items-center flex-col">
        {error && <p className="text-red-500 py-6">{error}</p>}
        {data && data.posts.length > 0 ? data.posts.map((video: VideoPost) => {
          return (
            <div key={video._id}>
              <div className="justify-between w-full p-3 border-zinc-700 border rounded-t-2xl flex items-center gap-2 text-sm">
                {video.author &&
                  <>
                    <div className="flex items-center gap-2 font-medium">
                      <Link href={`/home/users/${video.author._id}`} className="flex items-center gap-2 font-medium">
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-yellow-200">
                          <Image src={video.author.image} alt="user image" width={400} height={400} className="w-full h-full object-cover" />
                        </div>
                        <p>{video.author.username}</p>
                      </Link>
                    </div>
                    <FollowBtn user={video.author} classes='bg-transparent text-yellow-400 underline underline-offset-4 hover:text-yellow-300 text-sm' />
                  </>
                }
              </div>
              <div className="sm:w-[520px] w-full h-fit pb-2">
                <div className="w-full sm:h-[600px] h-[400px] bg-zinc-600">
                  <iframe
                    src={video.secure_url}
                    width="100%"
                    height="100%"
                    allowFullScreen
                  />
                </div>
                <div className="py-1">
                  <div className="flex items-center gap-3 py-2">
                    <Heart />
                    <Send />
                  </div>
                  <div className="font-medium">{video.title}</div>
                  <p className="text-sm">{video.description}</p>
                </div>
              </div>
            </div>
          )
        })
          :
          <div className="text-center py-12">
            <Camera size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Share Now</h2>
            <p className="text-gray-600">
              When people share photos, they will appear on feed.
            </p>
          </div>
        }
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white text-black font-medium rounded disabled:opacity-90 disabled:text-zinc-300 disabled:cursor-not-allowed"
        >
          <ChevronLeft />
        </button>
        <div className="font-medium">{currentPage}</div>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={!data}
          className="px-4 py-2 bg-yellow-400 text-black font-medium rounded disabled:bg-yellow-100 disabled:text-zinc-300 disabled:cursor-not-allowed"
        >
          <ChevronRight />
        </button>
      </div>

    </div>
  );
};

export default HomePage;
