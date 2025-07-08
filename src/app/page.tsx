'use client';

import Image from "next/image";
import { useState } from "react";

const wallPosts = [
  {
    author: "Anna",
    message: "Hey Greg, did you debug your coffee maker yet? Last cup tasted like JavaScript errors.",
  },
  {
    author: "Adelaida",
    message: "Greg, saw your last coding session—pretty sure you broke Stack Overflow again! 🧯",
  },
  {
    author: "Juho",
    message: "Greg, are you still coding in pajamas, or have you upgraded to full-time sweatpants mode?",
  },
  {
    author: "Maija",
    message: "Greg, rumor has it your computer has more stickers than code running on it. Confirm?",
  },
  {
    author: "Alex",
    message: "Yo Greg, just pulled an all-nighter on the assignment. Turns out sleep deprivation doesn’t improve coding skills. Weird!",
  },
  {
    author: "Sheryl",
    message: "Greg, when are we gonna deploy your latest dance moves to production? #AgileDancer",
  },
];

export default function Home() {
  const [input, setInput] = useState("");
  return (
    <div className="min-h-screen bg-[#fdf6f0] font-handwritten text-black">
      {/* Header */}
      <header className="bg-[#2196f3] text-white text-2xl font-bold px-4 py-2 rounded-t-lg w-full max-w-4xl mx-auto mt-4 shadow-md border border-blue-700">
        wall
      </header>
      <main className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto bg-white rounded-b-lg shadow-md border border-blue-700 border-t-0 p-6">
        {/* Profile Section */}
        <section className="flex flex-col items-center md:w-1/3">
          <Image
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Greg Wientjes"
            width={180}
            height={180}
            className="rounded-lg border-4 border-white shadow-md mb-4"
          />
          <div className="w-full">
            <h2 className="text-xl font-bold mb-1 text-black">Greg Wientjes</h2>
            <div className="bg-[#f7f7f7] border border-gray-300 rounded-lg p-2 mb-2">
              <div className="font-semibold text-sm mb-1 text-black">Information</div>
              <div className="text-xs text-black">
                <div className="mb-1">
                  <span className="font-semibold text-black">Networks</span><br />Stanford Alum
                </div>
                <div>
                  <span className="font-semibold text-black">Current City</span><br />Palo Alto, CA
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Wall Section */}
        <section className="flex-1 flex flex-col gap-4">
          <div>
            <div className="font-bold text-lg mb-1 text-black">Wall</div>
            <input
              type="text"
              className="w-full border-2 border-dashed border-black/70 rounded-xl p-2 bg-[#f7f7f7] text-base font-handwritten mb-2 text-black outline-none"
              placeholder="Write something..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              className="bg-[#2196f3] text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition-all float-right"
              disabled
            >
              Share
            </button>
          </div>
          <div className="clear-both mt-8 flex flex-col gap-4">
            {wallPosts.map((post, idx) => (
              <div key={idx} className="border-t border-black/40 pt-2">
                <div className="font-bold text-black">{post.author}</div>
                <div className="text-base font-handwritten text-black">{post.message}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}