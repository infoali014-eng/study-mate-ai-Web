import React from "react";

interface VideoSectionProps {
  videoUrl: string;
}

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videoUrl }) => {
  const videoId = getYouTubeVideoId(videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          Related Learning Video
        </h2>
        <p className="text-slate-500 text-xs font-medium">
          Watch a step-by-step video lecture to gain a deeper understanding.
        </p>
      </div>

      {/* Video Card */}
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:border-[#219EBC] shadow-sm">
          {thumbnailUrl ? (
            <>
              <img
                src={thumbnailUrl}
                alt="YouTube Video Thumbnail"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/20 group-hover:from-slate-950/70 transition-colors" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(33,158,188,0.15),transparent_70%)] opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
          )}

          {/* Play Button Icon */}
          <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#219EBC] group-hover:border-[#219EBC] text-white shadow-lg">
            <svg
              className="w-6 h-6 fill-current translate-x-0.5"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          {/* Prompt overlay text */}
          <div className="absolute bottom-3.5 left-4 z-10 text-xs font-bold text-white/90 group-hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors drop-shadow-md">
            <span>Watch on YouTube</span>
            <span className="text-[10px]">↗</span>
          </div>
        </div>
      </a>
    </div>
  );
};
