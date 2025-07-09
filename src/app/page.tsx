'use client';

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { supabase } from '../supabaseClient';

// Define a type for posts
type Post = {
  id: string;
  user_id?: string | null;
  body: string;
  created_at: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [profileImage, setProfileImage] = useState<string>("/profile.jpg");
  const [posts, setPosts] = useState<Post[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Load profile image from localStorage on mount
  useEffect(() => {
    const storedProfileImage = localStorage.getItem("wall_profile_image");
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }
  }, []);

  // Save profile image to localStorage whenever it changes
  useEffect(() => {
    // Only store if it's not the default
    if (profileImage !== "/profile.jpg") {
      localStorage.setItem("wall_profile_image", profileImage);
    }
  }, [profileImage]);

  // Fetch posts from Supabase on mount
  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPosts(data);
      }
    }
    fetchPosts();
  }, []);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleCameraClick() {
    fileInputRef.current?.click();
  }

  async function handleShare() {
    if (input.trim() && input.length <= 280) {
      const { data, error } = await supabase.from('posts').insert([
        {
          body: input,
          // user_id: null, // If you add auth, set this
        },
      ]).select();
      if (!error && data && data.length > 0) {
        setPosts([data[0], ...posts]);
        setInput("");
      }
    }
  }

  // Helper to format relative time
  function formatRelativeTime(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = (now.getTime() - date.getTime()) / 1000; // seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) === 1 ? '' : 's'} ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? '' : 's'} ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? '' : 's'} ago`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} week${Math.floor(diff / 604800) === 1 ? '' : 's'} ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) === 1 ? '' : 's'} ago`;
    return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) === 1 ? '' : 's'} ago`;
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f8fa] font-sans">
      {/* Header */}
      <header className="bg-[#2196f3] text-white text-2xl font-semibold px-6 py-3 w-full shadow-sm">
        wall
      </header>
      <main className="flex flex-row gap-8 max-w-7xl mx-auto py-8 px-4 h-[calc(100vh-64px)]">
        {/* Profile Section */}
        <aside className="w-80 flex-shrink-0 flex flex-col items-center bg-white rounded-xl shadow p-6 h-fit mt-2">
          <div
            className="relative group mb-4"
            style={{ width: 256, height: 320 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Image
              src={profileImage}
              alt="Profile"
              width={256}
              height={320}
              className="rounded-lg border-2 border-gray-200 object-cover"
              style={{ width: 256, height: 320 }}
            />
            <button
              type="button"
              onClick={handleCameraClick}
              className={`absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'} cursor-pointer`}
              tabIndex={-1}
              aria-label="Change profile photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-10 h-10 mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V7.5A2.25 2.25 0 0 1 5.25 5.25h2.086a2.25 2.25 0 0 0 1.591-.659l.828-.828A2.25 2.25 0 0 1 12.75 3h2.5a2.25 2.25 0 0 1 2.25 2.25v.75h.75A2.25 2.25 0 0 1 20.25 8.25v8.25A2.25 2.25 0 0 1 18 18.75H6A2.25 2.25 0 0 1 3.75 16.5v0z" />
                <circle cx="12" cy="13" r="3.25" stroke="white" strokeWidth="1.5" />
              </svg>
              <span className="text-white text-sm">upload a photo</span>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="w-full text-center">
            <h2 className="text-xl font-bold mb-0.5 text-gray-900">Lihle Magidigidi</h2>
            <div className="text-gray-500 text-sm mb-2">wall</div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2">
              <div className="font-medium text-sm mb-1 text-gray-700">Information</div>
              <div className="text-xs text-gray-600">
                <div className="mb-1">
                  <span className="font-semibold">Developer</span><br />Nelson Mandela University Alumni
                </div>
                <div>
                  <span className="font-semibold">Current City</span><br />Johannesburg, South Africa
                </div>
              </div>
            </div>
          </div>
        </aside>
        {/* Wall Section */}
        <section className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-6 mb-2">
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-base text-gray-900 bg-gray-50 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
              placeholder="What's on your mind?"
              rows={3}
              maxLength={280}
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">{280 - input.length} characters remaining</span>
              <button
                className={`font-semibold px-5 py-2 rounded-lg transition-colors ${input.trim() && input.length <= 280 ? 'bg-[#2196f3] text-white hover:bg-blue-600 cursor-pointer' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!input.trim() || input.length > 280}
                onClick={handleShare}
              >
                Share
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {posts.map((post, idx) => (
              <div className="mb-2" key={post.id || idx}>
                <div className="font-semibold text-gray-900">Lihle Magidigidi <span className="text-xs text-gray-400 ml-2">{post.created_at ? formatRelativeTime(post.created_at) : "just now"}</span></div>
                <div className="text-gray-700">{post.body}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
