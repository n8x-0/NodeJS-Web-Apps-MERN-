"use client"
import Header from "@/components/header";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import SEO from "@/components/seo";
import AuthSessionProvider from "@/context/authSession";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    
    return (
        <html lang="en">
            <SEO />
            <body className="w-full h-full">
                <AuthSessionProvider>
                    <Header />
                    <div className="flex w-full min-h-[90vh]">
                        <div className="md:block hidden">
                            <Sidebar />
                        </div>
                        {children}
                    </div>
                </AuthSessionProvider>
            </body>
        </html>
    )
}
