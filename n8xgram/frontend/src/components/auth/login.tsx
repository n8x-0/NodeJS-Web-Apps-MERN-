"use client";

import Link from "next/link";
import { emailValidator, passwordSanitizer } from "@/utils/validators";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthSessionContext } from "@/context/authSession";

const Login = () => {
    const session = useContext(AuthSessionContext)
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [formdata, setFormData] = useState({
        email: "",
        password: "",
    })

    useEffect(() => {
        if (session?.session) {
            router.push("/home");
            return
        }
    }, [session, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        try {
            if (name === "email") {
                emailValidator(value)
            }
            setError(null)
        } catch (error) {
            setError(error instanceof Error ? error.message : "A field is not valid")
        }
        setFormData({
            ...formdata,
            [name]: value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { email, password } = formdata;
        try {
            if (!email || !password) {
                throw new Error("All fields are required*")
            }

            emailValidator(email)
            passwordSanitizer(password)

            setError(null)
        } catch (error) {
            setLoading(false)
            setError(error instanceof Error ? error.message : "A field is invalid")
        }

        try {
            const user = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formdata),
                credentials: "include"
            })
            const resp = await user.json()
            if (user.ok) {
                router.push(`/profile/${resp._id}`)
                return
            } else {
                setLoading(false)
                setError(resp.error)
            }
        } catch (error) {
            setLoading(false)
            console.log("69 says: ", error);
            setError(error instanceof Error ? error.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-[#0A0A0A] p-4 w-full">
            <div className="w-full max-w-md bg-[#1A1A1A] rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Login to your Account</h2>
                <form className="space-y-6" onSubmit={handleSubmit} method="post">

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            onChange={handleChange}
                            value={formdata.email}
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="mt-1 block w-full px-4 py-2 bg-[#2A2A2A] border border-[#333333] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#555555]"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            onChange={handleChange}
                            value={formdata.password}
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="mt-1 block w-full px-4 py-2 bg-[#2A2A2A] border border-[#333333] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#555555]"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        disabled={error ? true : false}
                        type="submit"
                        className={`transition-all duration-800 w-full py-2 px-4 ${error ? "bg-zinc-300 text-zinc-400" : "bg-[#555555] text-white"} font-semibold rounded-md ${!error && "hover:bg-[#666666]"} focus:outline-none focus:ring-2 focus:ring-[#777777]`}>
                        {loading ? <div className="m-auto w-6 h-6 rounded-full border border-t-zinc-800 border-white animate-spin"></div> : "Login"}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-[#555555] hover:text-[#666666]">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;