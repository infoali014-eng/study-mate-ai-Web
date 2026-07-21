"use client";

export default function OwlCharacter() {
  return (
    <div className="relative pointer-events-none select-none">
      <img
        src="/owl.png"
        alt="Mr. Owl - StudyMate Mascot"
        width={135}
        height={185}
        className="object-contain drop-shadow-2xl"
        draggable={false}
      />
    </div>
  );
}
