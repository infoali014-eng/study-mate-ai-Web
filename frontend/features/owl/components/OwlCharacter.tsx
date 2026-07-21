"use client";

export default function OwlCharacter() {
  return (
    <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl shadow-xl shadow-indigo-500/20 border border-indigo-400/20 pointer-events-none">
      {/* Minimalist Premium Mascot SVG Representation (Owl) */}
      <svg
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white drop-shadow-md"
      >
        {/* Owl Ears / Tufts & Head outline */}
        <path d="M12 2C9.5 2 6 3.5 6 6.5v8c0 3 3 5.5 6 5.5s6-2.5 6-5.5v-8c0-3-3.5-4.5-6-4.5z" />
        
        {/* Owl Eyes */}
        <circle cx="9" cy="10" r="2.5" fill="white" />
        <circle cx="15" cy="10" r="2.5" fill="white" />
        <circle cx="9" cy="10" r="1" fill="black" />
        <circle cx="15" cy="10" r="1" fill="black" />
        
        {/* Beak */}
        <polygon points="12,12 10.5,14 13.5,14" fill="#fbbf24" stroke="#fbbf24" />
        
        {/* Chest plumage decoration */}
        <path d="M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5" />
      </svg>
    </div>
  );
}
