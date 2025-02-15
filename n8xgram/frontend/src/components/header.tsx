"use client"
import { sessionCont } from '@/context/session';
import { Search, Heart, Send, PlusSquare, Home, Compass } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

const Header = () => {
    const session = useContext(sessionCont)
    const authData = session?.userSession

    const icons = [
        { icon: Home, link: "/home" },
        { icon: Send, link: "/home" },
        { icon: PlusSquare, link: `/profile/${authData?._id}/post` },
        { icon: Compass, link: "/home/users" },
        { icon: Heart, link: "/home" },
    ];

    return (
        <header className="  bg-[#0A0A0A] border-b border-gray-800 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

                <div className="flex-shrink-0">
                    <h1 className="text-2xl font-bold italic text-yellow-500">n8x</h1>
                </div>
                {authData &&
                    <div className="hidden md:flex items-center bg-gray-900 rounded-lg px-3 py-1 mx-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent border-none text-sm text-white placeholder-gray-400 focus:outline-none px-3 py-1 w-64"
                        />
                    </div>
                }
                {
                    authData ?
                        <div className="flex items-center space-x-6">
                            {icons.map((data, index) => {
                                return (
                                    <Link href={data.link} key={index}>
                                        <data.icon className="h-6 w-6 text-white cursor-pointer" />
                                    </Link>
                                )
                            })}

                            <Link href={`/profile/${authData._id}`} className="h-8 w-8 rounded-full cursor-pointer overflow-hidden ring-2 ring-yellow-400">
                                <Image
                                    src={authData.image}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    width={600}
                                    height={600}
                                />
                            </Link>
                        </div>
                        :
                        <div className="flex items-center space-x-6">
                            <Link href={"/"} className='font-medium text-sm'>Login</Link>
                            <Link href={"/register"} className='bg-yellow-500 px-5 py-2 rounded text-black font-medium text-sm'>Register</Link>
                        </div>
                }
            </div>
        </header>
    );
};

export default Header;