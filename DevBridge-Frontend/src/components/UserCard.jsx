import React, { useMemo, useRef, useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80";
const SWIPE_THRESHOLD = 120;

const UserCard = ({ user, onIgnore, onInterested, loading = false }) => {
  const cardRef = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState(null);
  const startXRef = useRef(0);

  if (!user) return null;

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const ageText = user?.age ? `${user.age}` : "N/A";
  const genderText = user?.gender || "Not specified";
  const aboutText = user?.about || "Passionate developer looking to collaborate.";
  const rotateDeg = dragX / 20;
  const likeOpacity = Math.min(Math.max(dragX / SWIPE_THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragX / SWIPE_THRESHOLD, 0), 1);

  const cardStyle = useMemo(() => {
    if (exitDirection === "right") {
      return {
        transform: `translateX(520px) rotate(18deg)`,
        transition: "transform 260ms ease-out",
      };
    }
    if (exitDirection === "left") {
      return {
        transform: `translateX(-520px) rotate(-18deg)`,
        transition: "transform 260ms ease-out",
      };
    }
    return {
      transform: `translateX(${dragX}px) rotate(${rotateDeg}deg)`,
      transition: isDragging ? "none" : "transform 220ms ease",
    };
  }, [dragX, rotateDeg, isDragging, exitDirection]);

  const onPointerDown = (e) => {
    if (loading || exitDirection) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging || loading || exitDirection) return;
    const delta = e.clientX - startXRef.current;
    setDragX(delta);
  };

  const triggerSwipe = async (direction) => {
    setExitDirection(direction);
    window.setTimeout(async () => {
      if (direction === "right") {
        await onInterested?.();
      } else {
        await onIgnore?.();
      }
      setExitDirection(null);
      setDragX(0);
    }, 230);
  };

  const onPointerEnd = () => {
    if (!isDragging || loading || exitDirection) return;
    setIsDragging(false);

    if (dragX > SWIPE_THRESHOLD) {
      triggerSwipe("right");
      return;
    }
    if (dragX < -SWIPE_THRESHOLD) {
      triggerSwipe("left");
      return;
    }
    setDragX(0);
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div
        ref={cardRef}
        style={cardStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        className="relative h-[560px] cursor-grab overflow-hidden rounded-[28px] border border-white/20 bg-slate-900 shadow-2xl active:cursor-grabbing"
      >
        <img
          src={user?.photoUrl || FALLBACK_IMAGE}
          alt={`${fullName || "User"} profile`}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div
          className="absolute left-4 top-4 rounded-lg border-2 border-red-400 bg-black/30 px-3 py-1 text-sm font-bold tracking-widest text-red-300"
          style={{ opacity: nopeOpacity }}
        >
          NOPE
        </div>
        <div
          className="absolute right-4 top-4 rounded-lg border-2 border-emerald-400 bg-black/30 px-3 py-1 text-sm font-bold tracking-widest text-emerald-300"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="mb-2 flex items-end justify-between gap-2">
            <h3 className="text-2xl font-bold tracking-tight">
              {fullName || "Developer"}{" "}
              <span className="text-lg font-medium text-white/90">{ageText}</span>
            </h3>
          </div>

          <p className="mb-2 text-sm font-medium text-white/85">{genderText}</p>
          <p className="line-clamp-3 text-sm text-white/90">{aboutText}</p>

          {user?.skills?.length > 0 && (
            <p className="mt-3 text-xs text-white/80">
              Skills: {user.skills.slice(0, 5).join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={onIgnore}
          disabled={loading}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/15 text-2xl text-white shadow-lg backdrop-blur hover:bg-white/25"
          aria-label="Ignore profile"
        >
          ✕
        </button>
        <button
          type="button"
          onClick={onInterested}
          disabled={loading}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-2xl text-white shadow-lg hover:from-pink-600 hover:to-rose-600"
          aria-label="Like profile"
        >
          ❤
        </button>
      </div>
    </div>
  );
};

export default UserCard;
