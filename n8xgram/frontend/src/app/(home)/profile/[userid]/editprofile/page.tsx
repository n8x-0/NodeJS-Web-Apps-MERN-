"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { LogOut } from "lucide-react";
import Uploadpicbtn from "@/components/profile/uploadpicbtn";
import { sessionCont } from "@/context/session";

const ProfileEditPage = () => {
    const router = useRouter();
    const { userid } = useParams();
    const session = useContext(sessionCont);
    const [userData, setUserData] = useState({
        username: "",
        bio: "",
        image: ""
    });
    const [loading, setLoading] = useState(false);

    const userSession = session?.userSession

    useEffect(() => {
        if (userSession) {
            const { username, bio, image } = userSession as {
                username: string;
                bio: string;
                image: string;
            };
            setUserData({
                username,
                bio,
                image
            });
        }
    }, [userSession]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${userid}/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
                credentials: "include",
            });
            if (!res.ok) {
                throw new Error("Failed to update profile");
            }
            await session?.getUserSession();
            router.push(`/home/profile/${userid}`);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${userid}/logout`, {
                method: "GET",
                credentials: "include",
            });
        } catch (error) {
            console.error(error);
        }
        router.push("/");
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex flex-col items-center">
                <Uploadpicbtn userid={userid as string} userData={userData} />
                <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Username</label>
                        <input
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            type="text"
                            className="w-full mt-1 p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring focus:border-yellow-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Bio</label>
                        <textarea
                            name="bio"
                            value={userData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full mt-1 p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring focus:border-yellow-500"
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                        >
                            {loading ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </form>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default ProfileEditPage;