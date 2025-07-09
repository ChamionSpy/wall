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
  photo_url?: string | null;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

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
          // This function is no longer needed as profile image is fixed
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleCameraClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedPhoto(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  }

  function handlePhotoBoxClick() {
    fileInputRef.current?.click();
  }

  async function handleShare() {
    if (!input.trim() && !selectedPhoto) return; // Don't allow empty posts

    let photo_url = null;
    if (selectedPhoto) {
      // Sanitize file name
      const cleanName = selectedPhoto.name.replace(/[^a-zA-Z0-9.\\-_]/g, '_');
      const fileName = `${Date.now()}-${cleanName}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('post-photos')
        .upload(fileName, selectedPhoto, { upsert: false });
      if (!storageError && storageData) {
        const { data: publicUrlData } = supabase.storage
          .from('post-photos')
          .getPublicUrl(fileName);
        photo_url = publicUrlData.publicUrl;
      } else {
        alert('Photo upload failed: ' + (storageError?.message || 'Unknown error'));
        return;
      }
    }

    // Insert the post into Supabase
    const { data, error } = await supabase.from('posts').insert([
      {
        body: input,
        photo_url,
        // user_id: null, // If you add auth, set this
      },
    ]).select();

    if (!error && data && data.length > 0) {
      setPosts([data[0], ...posts]);
      setInput("");
      setSelectedPhoto(null);
      setPhotoPreview(null);
    } else {
      alert('Post creation failed: ' + (error?.message || 'Unknown error'));
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
            className="relative mb-4"
            style={{ width: 256, height: 320 }}
          >
            <Image
              src="/profile.jpg"
              alt="Profile"
              width={256}
              height={320}
              className="rounded-lg border-2 border-gray-200 object-cover"
              style={{ width: 256, height: 320 }}
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
            {/* Character count below textarea */}
            <div className="text-xs text-gray-400 mt-1 mb-3">{280 - input.length} characters remaining</div>
            {/* Photo upload area */}
            <div
              className="w-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer hover:border-blue-400 transition mb-2 relative min-h-[120px]"
              onClick={handlePhotoBoxClick}
              tabIndex={0}
              role="button"
              aria-label="Add photo"
            >
              {photoPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                  <button
                    type="button"
                    className="text-xs text-red-500 hover:underline mt-1"
                    onClick={e => { e.stopPropagation(); setSelectedPhoto(null); setPhotoPreview(null); }}
                  >
                    Remove photo
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#bdbdbd" className="w-10 h-10 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V7.5A2.25 2.25 0 0 1 5.25 5.25h2.086a2.25 2.25 0 0 0 1.591-.659l.828-.828A2.25 2.25 0 0 1 12.75 3h2.5a2.25 2.25 0 0 1 2.25 2.25v.75h.75A2.25 2.25 0 0 1 20.25 8.25v8.25A2.25 2.25 0 0 1 18 18.75H6A2.25 2.25 0 0 1 3.75 16.5v0z" />
                    <circle cx="12" cy="13" r="3.25" stroke="#bdbdbd" strokeWidth="1.5" />
                  </svg>
                  <span className="text-gray-500 font-medium">Click to add photo <span className="text-gray-400 font-normal">(optional)</span></span>
                  <span className="text-gray-400 text-xs mt-1">JPG, PNG, GIF up to 5MB</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div className="flex justify-end items-center mt-2">
              <button
                className={`font-semibold px-5 py-2 rounded-lg transition-colors ${(input.trim() || selectedPhoto) ? 'bg-[#2196f3] text-white hover:bg-blue-600 cursor-pointer' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!(input.trim() || selectedPhoto)}
                onClick={handleShare}
              >
                Share
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {posts.map((post, idx) => (
              <div
                className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-100"
                key={post.id || idx}
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src="/profile.jpg"
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      Lihle Magidigidi
                      <span className="text-xs text-gray-400 ml-2">
                        {post.created_at ? formatRelativeTime(post.created_at) : "just now"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-700">{post.body}</div>
                {post.photo_url && (
                  <img src={post.photo_url} alt="Post" className="mt-2 w-full max-w-xs rounded border" />
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
