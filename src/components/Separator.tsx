import React from "react";

export const Separator = () => {
  return (
    <div className="min-h-screen grid grid-cols-2 mt-8">
      {/* LEFT CARD */}
      <div className="relative group h-full w-full overflow-hidden">
        <img
          src="/assets/MOVA.jpg"
          alt="pants MOVA image"
          className="h-full w-full object-cover"
        />

        {/* Overlay content */}
        <div className="
          absolute inset-0 
          flex flex-col justify-end 
          bg-black/0 group-hover:bg-black/40 
          opacity-0 group-hover:opacity-100
          transition-all duration-500
          p-10
        ">
          <p className="text-4xl font-druk text-white">
            ULTRA LUXE SUPIMA COTTON
          </p>
          <button className="
            text-3xl mt-4 underline hover:no-underline 
            text-white cursor-pointer
          ">
            Explore Active Lounge
          </button>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="relative group h-full w-full overflow-hidden">
        <img
          src="/assets/sideImage.png"
          alt="side image"
          className="h-full w-full object-cover"
        />

        <div className="
          absolute inset-0 
          flex flex-col justify-end 
          bg-black/0 group-hover:bg-black/40 
          opacity-0 group-hover:opacity-100
          transition-all duration-500
          p-10  
        ">
          <p className="text-4xl font-druk text-white">
            ULTRA LUXE SUPIMA COTTON
          </p>
          <button className="
            text-3xl mt-4 underline hover:no-underline
            text-white cursor-pointer
          ">
            Explore Active Lounge
          </button>
        </div>
      </div>
    </div>
  );
};
