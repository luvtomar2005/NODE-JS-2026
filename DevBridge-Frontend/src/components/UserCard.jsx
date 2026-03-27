import React from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80";

const UserCard = ({ user }) => {
  if (!user) return null;

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const ageText = user?.age ? `${user.age}` : "N/A";
  const genderText = user?.gender || "Not specified";
  const aboutText = user?.about || "Passionate developer looking to collaborate.";

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative h-[560px] overflow-hidden rounded-[28px] border border-white/20 bg-slate-900 shadow-2xl">
        <img
          src={user?.photoUrl || FALLBACK_IMAGE}
          alt={`${fullName || "User"} profile`}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

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
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/15 text-2xl text-white shadow-lg backdrop-blur hover:bg-white/25"
          aria-label="Ignore profile"
        >
          ✕
        </button>
        <button
          type="button"
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
