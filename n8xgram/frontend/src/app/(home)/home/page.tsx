import FollowBtn from '@/components/followbtn'
import { Heart, PlaneIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface HomeVdoListIface {
  videoId: string,
  assets: { iframe: string },
  title: string,
  description: string,
  author: {
    _id: string,
    username: string,
    image: string,
    followers: string[],
    followings: string[]
  }
}

const page = async () => {

  const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/videos`, {
    method: "POST",
    body: JSON.stringify(1),
    cache: "no-store"
  })
  const data = await req.json()
  
  return (
    <div className='max-w-3xl mx-auto p-3 flex-1 max-h-[90vh] overflow-auto hideScrollbar'>
      <div className='w-full flex justify-center items-center flex-col'>
        {data.map((data: HomeVdoListIface) => {
          return (
            <div key={data.videoId}>
              <div className='justify-between w-full p-3 border-zinc-700 border rounded-t-2xl flex items-center gap-2 text-sm'>
                <Link href={`/home/users/${data.author._id}`} className='flex items-center gap-2 font-medium'>
                  <div className='w-8 h-8 rounded-full overflow-hidden ring-1 ring-yellow-200'>
                    <Image src={data.author.image} alt="user image" width={400} height={400} className='w-full h-full object-cover' />
                  </div>
                  <p>{data.author.username}</p>
                </Link>
                <FollowBtn user={data.author} />
              </div>
              <div className='w-[520px] h-fit pb-2'>
                <div
                  className='w-full h-[520px] bg-zinc-600'
                  dangerouslySetInnerHTML={{ __html: data.assets.iframe }}
                />
                <div className='py-1'>
                  <div className='flex items-center gap-3 py-2'>
                    <Heart />
                    <PlaneIcon />
                  </div>
                  <div className='font-medium'>{data.title}</div>
                  <p className='text-sm'>{data.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default page