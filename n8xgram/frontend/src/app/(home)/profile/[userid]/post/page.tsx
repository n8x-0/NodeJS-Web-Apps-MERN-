"use client";
import { AuthSessionContext } from "@/context/authSession";
import { uploadVideo } from "@/utils/posts/postactions";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState, ChangeEvent, useContext, useEffect } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import { CloudinaryUploadResponse } from "@/utils/types";

const CreatePost = () => {
  const { session } = useContext(AuthSessionContext) as { session: { _id: string } };
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session, router]);

  const params = useParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [error, setError] = useState<string | null>("Please fill the required fields");
  const [loading, setLoading] = useState<boolean>(false);
  const [resource, setResource] = useState<{ secure_url: string }>({ secure_url: "" });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (!updated.title.trim() && !updated.description.trim()) {
        setError("Please fill the required fields");
      } else if (!updated.title.trim()) {
        setError("Please give your post a title");
      } else if (!updated.description.trim()) {
        setError("Please give your post a description");
      } else {
        setError(null);
      }
      return updated;
    });
  };

  return (
    <div className="w-full min-h-[90vh] p-3">
      <div className="max-w-[1200px] w-full mx-auto md:p-12 lg:flex">
        <div className="flex-1 px-4 flex justify-between flex-col hideScrollbar">
          <div className="space-y-6">
            <input
              onChange={handleChange}
              value={formData.title}
              type="text"
              name="title"
              placeholder="title"
              className="mt-1 block w-full px-4 py-2 bg-transparent border-b border-[#333333] text-white placeholder-gray-400 focus:outline-none"
            />
            <textarea
              onChange={handleChange}
              value={formData.description}
              rows={3}
              name="description"
              placeholder="description"
              className="hideScrollbar mt-1 block w-full px-4 py-2 bg-transparent border-b border-[#333333] text-white placeholder-gray-400 focus:outline-none resize-none"
            ></textarea>
            <input
              onChange={handleChange}
              value={formData.tags}
              type="text"
              name="tags"
              placeholder="tags"
              className="mt-1 block w-full px-4 py-2 bg-transparent border-b border-[#333333] text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <CldUploadWidget 
              signatureEndpoint={`${process.env.NEXT_PUBLIC_BASE_URL}/videos/signed`}
              onSuccess={ async (result, { widget }) => {
                if (result.event === "success") {
                  console.log(result);
                  const {
                    secure_url,
                    thumbnail_url,
                    original_filename,
                    height,
                    width,
                    resource_type,
                    format,
                    bytes
                  } = result.info as CloudinaryUploadResponse;
                  const { title, description, tags } = formData;
                  const data = {
                    title,
                    description,
                    tags,
                    secure_url,
                    thumbnail_url,
                    original_filename,
                    height,
                    width,
                    resource_type,
                    format,
                    bytes
                  };
                  try {
                    await uploadVideo(data);
                  } catch (error) {
                    if(error instanceof Error){
                      setError(error.message);
                    }
                  }
                }
                widget.close();
              }}
            >
              {({ open }) => {
                return (
                  <button
                    onClick={() => open()}
                    disabled={loading || (error !== null)}
                    className={`w-full p-2 mt-6 ${loading || error ? "bg-zinc-300 text-zinc-100" : "bg-yellow-500 text-black"} transition-all font-medium rounded`}
                  >
                    {loading ? (
                      <p className="m-auto animate-spin w-6 h-6 border rounded-full border-black border-t-yellow-800"></p>
                    ) : (
                      "Upload post"
                    )}
                  </button>
                );
              }}
            </CldUploadWidget>
            {error && <p className="text-sm text-red-500 pt-1">{error}</p>}
          </div>
        </div>
      </div>
      <div className="w-full text-center px-6 text-zinc-600 font-medium">
        In production vercel limits the file <b className="text-zinc-400">upload to 4.5mb</b>,
        while current integration doesn&apos;t support client side upload, which will be configured and scaled as soon as possible
      </div>
    </div>
  );
};

export default CreatePost;