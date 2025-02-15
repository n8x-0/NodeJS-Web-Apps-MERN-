"use client"
import Header from "@/components/header";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import SessionProvider from "@/context/session";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    
    return (
        <html lang="en">
            <body className="w-full h-full">
                <SessionProvider>
                    <Header />
                    <div className="flex w-full min-h-[90vh]">
                        <div className="md:block hidden">
                            <Sidebar />
                        </div>
                        {children}
                    </div>
                </SessionProvider>
            </body>
        </html>
    )
}
