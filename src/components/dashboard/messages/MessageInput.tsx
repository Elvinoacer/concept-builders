"use client";
import React from "react";
import Image from "next/image";

const MessageInput = () => {
  return (
    <div className="mt-6 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-cover bg-center shrink-0">
        <Image
          src="https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg"
          alt="User avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex-1 relative">
        <input
          className="w-full h-12 px-4 pr-20 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400"
          placeholder="Type a message..."
          type="text"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-500 ml-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
