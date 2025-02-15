"use client"
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import ErrorPopup from "../errorpopup";
import Image from "next/image";

const Uploadpicbtn = ({ userid, userData }: { userid: string, userData: { username: string, image: string } }) => {
    const chosefile = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null)

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target

        if (!files) {
            return
        } else if (!files[0].type.includes("image")) {
            setError("Only images are allowed... !")
            setTimeout(() => {
                setError(null)
            }, 3000)
            return
        }
        const formdata = new FormData()
        formdata.append("file", files[0])
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${userid}/updprofimg`, {
                method: "POST",
                body: formdata,
                credentials: "include",
                cache: "no-store"
            })
            const data = await res.json()
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    if (error) {
        return <ErrorPopup message={error as string} />
    }

    return (
        <div className="relative">
            {
                userData ?
                    <Image
                        width={600}
                        height={600}
                        src={userData.image}
                        alt={userData.username}
                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                    /> : ""
            }
            <button className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full text-white">
                <div onClick={() => chosefile.current?.click()}>
                    <Camera size={16} className="text-black" />
                    <input type="file" className="hidden" ref={chosefile} onChange={handleChange} />
                </div>
            </button>
        </div>
    )
}

export default Uploadpicbtn