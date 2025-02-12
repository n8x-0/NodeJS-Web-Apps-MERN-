"use client";

import FollowBtn from '@/components/followbtn';
import { Camera, Heart, PlaneIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface HomeVdoListIface {
  videoId: string;
  assets: { player: string };
  title: string;
  description: string;
  author: {
    _id: string;
    username: string;
    image: string;
    followers: string[];
    followings: string[];
  };
}

const HomePage = () => {
  const [data, setData] = useState<HomeVdoListIface[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/videos`, {
          method: "POST",
          body: JSON.stringify({page: 1}),
          cache: "no-store",
        });

        if (!req.ok) throw new Error("Failed to fetch videos.");
        const result = await req.json();
        console.log(result);

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-3 flex-1 max-h-[90vh] overflow-auto hideScrollbar">
      <div className="w-full flex justify-center items-center flex-col">
        {error && <p className="text-red-500 py-6">{error}</p>}
        {data && data.length > 0 ? data.map((video) => {
          return (
            <div key={video.videoId}>
              <div className="justify-between w-full p-3 border-zinc-700 border rounded-t-2xl flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Link href={`/home/users/${video.author._id}`} className="flex items-center gap-2 font-medium">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-yellow-200">
                    <Image src={video.author.image} alt="user image" width={400} height={400} className="w-full h-full object-cover" />
                  </div>
                  <p>{video.author.username}</p>
                  </Link>
                </div>
                <FollowBtn user={video.author} />
              </div>
              <div className="w-[520px] h-fit pb-2">
                <div className="w-full h-[520px] bg-zinc-600">
                  <iframe
                    src={video.assets.player}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>              <div className="py-1">
                  <div className="flex items-center gap-3 py-2">
                    <Heart />
                    <PlaneIcon />
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
    </div>
  );
};

export default HomePage;
