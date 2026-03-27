import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [about, setAbout] = useState(user?.about || "");
  const [skillsInput, setSkillsInput] = useState(
    Array.isArray(user?.skills) ? user.skills.join(", ") : "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const parsedSkills = useMemo(
    () =>
      skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    [skillsInput],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        about: about.trim(),
        skills: parsedSkills,
      };

      const res = await axios.patch(BASE_URL + "/profile/edit", payload, {
        withCredentials: true,
      });

      dispatch(addUser(res?.data?.data));
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err?.response?.data || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 text-white">
        Loading profile...
      </div>
    );
  }

  const previewName = `${firstName} ${lastName}`.trim() || "Your Name";
  const previewAbout = about.trim() || "Tell people what you build and love.";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-5 rounded-2xl border border-violet-200/50 bg-white/80 p-4 backdrop-blur">
        <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
        <p className="mt-1 text-sm text-slate-600">
          Keep your profile sharp so the right developers find you.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-md backdrop-blur"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              First Name
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                placeholder="Enter first name"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Last Name
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                placeholder="Enter last name"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            About
            <textarea
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              placeholder="Share your work, interests, or goals..."
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Skills (comma separated)
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              placeholder="React, Node.js, MongoDB"
            />
          </label>

          {error && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 h-11 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-md backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
            Live Preview
          </p>
          <div className="mt-3 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-[1px]">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <img
                src={
                  user?.photoUrl ||
                  "https://api.dicebear.com/9.x/thumbs/svg?seed=DevBridge"
                }
                alt="Profile preview"
                className="h-16 w-16 rounded-full border border-white/30 object-cover"
              />
              <h3 className="mt-3 text-xl font-bold">{previewName}</h3>
              <p className="mt-2 text-sm text-white/85">{previewAbout}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(parsedSkills.length ? parsedSkills : ["Add skills..."]).map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs"
                    >
                      {skill}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;