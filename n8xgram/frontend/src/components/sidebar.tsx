"use client"
import React, { useContext, useState } from 'react';
import {
  Home,
  Search,
  Heart,
  PlusSquare,
  Menu,
  MessageCircle,
  Compass,
  Film,
  User,
  Instagram
} from 'lucide-react';
import { AuthSessionContext } from '@/context/authSession'; import Link from 'next/link';
;

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { session } = useContext(AuthSessionContext) as { session: { _id: string } }
  if (!session) return <></>

  const menuItems = [
    { icon: Home, label: 'Home', route: `/home` },
    { icon: Search, label: 'Search', route: `/` },
    { icon: Compass, label: 'Explore', route: `/home/users` },
    { icon: Film, label: 'Reels', route: `/` },
    { icon: MessageCircle, label: 'Messages', route: `` },
    { icon: Heart, label: 'Notifications', route: `` },
    { icon: PlusSquare, label: 'Create', route: `/profile/${session._id}/post` },
    { icon: User, label: 'Profile', route: `/profile/${session._id}` }
  ];

  return (
    <div
      className={`
        fixed left-0 top-0 h-full bg-[#0A0A0A] border-r border-zinc-800
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-64' : 'w-20'}
        flex flex-col
        md:relative
      `}
    >
      {/* Logo Section */}
      <div className={`p-6 mb-4 ${!isExpanded && `m-auto`} transition-all`}>
        {isExpanded ? (
          <Instagram className="h-8 w-auto" />
        ) : (
          <Instagram className="h-6 w-6" />
        )}
      </div>

      <nav className="flex-1">
        {menuItems.map((item, index) => (
          <Link href={item.route as string} key={index} className={`w-full flex items-center ${!isExpanded && `justify-center`} p-4 hover:bg-zinc-900 transition-all`}>
            <item.icon className="h-6 w-6" />
            {isExpanded && (
              <span className="ml-4 text-sm font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      <button onClick={() => setIsExpanded(!isExpanded)} className={`p-4 flex items-center hover:bg-gray-100 transition-all ${!isExpanded && `m-auto`}`}>
        <Menu className="h-6 w-6" />
        {isExpanded && (
          <span className={`ml-4 text-sm font-medium `}>More</span>
        )}
      </button>
    </div>
  );
};

export default Sidebar;