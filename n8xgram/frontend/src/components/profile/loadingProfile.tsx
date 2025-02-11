"use client";

const LoadingProfile = () => {
    return (
        <div className="max-w-3xl mx-auto p-3 flex-1 animate-pulse">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
                
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-zinc-800"></div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="h-6 w-48 bg-zinc-800 rounded"></div>
                    <div className="h-4 w-40 bg-zinc-800 rounded"></div>
                    <div className="flex gap-4">
                        <div className="h-4 w-20 bg-zinc-800 rounded"></div>
                        <div className="h-4 w-20 bg-zinc-800 rounded"></div>
                        <div className="h-4 w-20 bg-zinc-800 rounded"></div>
                    </div>
                </div>
            </div>
            
            <div className="border-t pt-4">
                <div className="flex justify-center gap-12 mb-4">
                    <div className="h-6 w-24 bg-zinc-800 rounded"></div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="aspect-square bg-zinc-800 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingProfile;