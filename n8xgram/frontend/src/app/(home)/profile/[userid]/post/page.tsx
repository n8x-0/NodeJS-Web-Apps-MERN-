"use client"
import { sessionCont } from "@/context/session";
import { uploadVideo } from "@/utils/posts/postactions";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState, ChangeEvent, useContext } from "react";

const CreatePost = () => {
  const session = useContext(sessionCont)
  const router = useRouter()

  if(!session?.userSession){
    router.push('/')
  }

  const params = useParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);

    setError(null)
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null)
    setLoading(true)
    const formdata = new FormData(e.target as HTMLFormElement);
    const { name } = formdata.get("file") as { name: string }

    try {
      if (!name) {
        throw new Error("A vidoe file must be reqired.")
      }

      const tagsStr = formdata.get("tags") as string
      const tags = tagsStr?.split(' ')
      formdata.delete("tags")
      formdata.append("tags", JSON.stringify(tags));

      const response = await uploadVideo(formdata, session?.userSession)
      if (response) router.push(`/profile/${params.userid}`)
      return  
    } catch (error) {
      setLoading(false)
      setError(error instanceof Error ? error.message : "Someting went wrong")
    }
  };

  return (
    <div className="w-full min-h-[90vh] p-3">
      <form className="max-w-[1200px] w-full mx-auto md:p-12 lg:flex" onSubmit={handleSubmit}>
        <div className="flex-1 px-4 flex justify-between flex-col hideScrollbar">
          <div className="space-y-6">
            <input
              type="text"
              name="title"
              placeholder="title"
              className="mt-1 block w-full px-4 py-2 bg-transparent border-b border-[#333333] text-white placeholder-gray-400 focus:outline-none"
            />
            <textarea
              rows={3}
              name="description"
              placeholder="description"
              className="hideScrollbar mt-1 block w-full px-4 py-2 bg-transparent border-b border-[#333333] text-white placeholder-gray-400 focus:outline-none resize-none"
            ></textarea>
            <input
              type="text"
              name="tags"
              placeholder="tags"
              className="mt-1 block w-full px-4 py-2 bg-transparent border-b border-[#333333] text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="file"
              name="file"
              className="hidden"
              ref={fileRef}
              onChange={handleFileChange}
              accept="video/*"
            />
          </div>
          <div>
            <button
              disabled={loading || error ? true : false}
              type="submit"
              className={`w-full p-2 mt-2 ${loading || error ? "bg-zinc-300 text-zinc-100" : "bg-yellow-500 text-black"} transition-all font-medium rounded`}>
              {loading ?
                <p className="m-auto animate-spin w-6 h-6 border rounded-full border-black border-t-yellow-800"></p>
                : "Post"}
            </button>
            {error && <p className="text-sm text-red-500 pt-1">{error}</p>}
          </div>
        </div>
        <div className="lg:w-80 w-full lg:py-0 py-6" onClick={() => fileRef.current?.click()}>
          <div className="w-full h-[420px] border border-zinc-700 rounded-3xl flex items-center justify-center">
            {videoPreview ? (
              <video src={videoPreview} controls className="w-full h-full object-cover" />
            ) : (
              <span className="text-white w-32 h-32 flex justify-center items-center border border-zinc-600 rounded-full">
                <Plus size={30} className="text-zinc-600" />
              </span>
            )}
          </div>
        </div>
      </form>

      <div className="w-full text-center px-6 text-zinc-600 font-medium">In production vercel limits the file <b className="text-zinc-400">upload to 4.5mb</b>, while current integration doesn&apos;t support client side upload, which will be configured and scaled as soon as possible</div>
    </div>
  );
};

export default CreatePost;