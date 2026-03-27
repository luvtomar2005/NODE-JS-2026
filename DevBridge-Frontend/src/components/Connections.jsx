import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      setConnections(res.data.data);
    } catch (err) {
      setError(err?.response?.data || "Failed to load connections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-violet-600 font-semibold text-xl">
        Loading your connections...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-20 text-red-500 font-semibold text-xl">
        {error}
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center mt-24 text-center px-4">
        <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-100/60 blur-2xl"></div>
          <svg
            className="relative h-28 w-28 text-indigo-500 drop-shadow-sm"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="30" cy="50" r="14" fill="currentColor" fillOpacity="0.9" />
            <circle cx="70" cy="30" r="16" fill="currentColor" fillOpacity="0.8" />
            <circle cx="65" cy="75" r="11" fill="currentColor" fillOpacity="0.7" />
            <path
              d="M38 45 L62 35"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="4 6"
            />
            <path
              d="M40 58 L57 70"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="3 5"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          No connections yet
        </h2>
        <p className="mt-3 text-slate-500 font-medium leading-relaxed">
          Your network is waiting. Start swiping and matching to build your DevBridge community.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Your Connections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((user) => (
          <div
            key={user._id}
            className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 transition hover:shadow-md"
          >
            <div className="h-32 bg-gradient-to-r from-indigo-100 via-violet-100 to-fuchsia-100"></div>
            <div className="px-6 pb-6 relative -mt-12 flex flex-col items-center">
              <img
                src={
                  user.photoUrl ||
                  "https://api.dicebear.com/9.x/thumbs/svg?seed=" + user.firstName
                }
                alt={user.firstName}
                className="h-24 w-24 rounded-full border-4 border-white object-cover bg-white shadow-sm"
              />
              <div className="mt-3 text-center">
                <h3 className="text-xl font-bold text-slate-900">
                  {user.firstName} {user.lastName}
                  {user.age && <span className="ml-2 font-normal text-slate-500">{user.age}</span>}
                </h3>
                {user.gender && (
                  <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mt-1">
                    {user.gender}
                  </p>
                )}
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                  {user.about}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {user.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button className="mt-6 w-full rounded-full bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700">
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
