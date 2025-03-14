"use client"
import FollowBtn from "@/components/followbtn"
import { AuthSessionContext } from "@/context/authSession"
import { UserT } from "@/utils/types"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"


const UsersPage = () => {
  const session = useContext(AuthSessionContext)
  const router = useRouter()

  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<UserT[]>([])
  const currUserId = session?.session?._id

  const fetchUsers = async () => {
      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${currUserId}/allusers`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-cache"
        })
        const data = await req.json()
        if (req.ok) {
          console.log("users fetched");
          setUsers(data)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Something went wrong')
      }
  }

  useEffect(() => {
    if(!session?.session){
      router.push('/')
    }
  
    fetchUsers()
  }, [])

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    )
  }
  
  return (
    <div className="w-[540px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Suggested Users</h1>
      <div className="space-y-4 w-full">
        {users.map((user) => {
          console.log(user);
          return (
            <div key={user._id} className="border-b shadow p-4">
              <div className="flex items-center justify-between">
                <Link href={`/home/users/${user._id}`} className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden ring-1 ring-yellow-500">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.username}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </Link>
                <FollowBtn user={user} currUserId={currUserId as string} classes="bg-yellow-500 hover:bg-yellow-400 text-sm"/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UsersPage