import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/FeedSlice";
import axios from "axios";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const getFeed = async () => {
    if (feed?.length) return;
    try {
      setError("");
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data || []));
    } catch (err) {
      setError("Unable to load feed");
    }
  };

  const handleCardAction = async (status, toUserId) => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      setError("");
      await axios.post(
        `${BASE_URL}/request/send/${status}/${toUserId}`,
        {},
        { withCredentials: true },
      );
      dispatch(addFeed((feed || []).slice(1)));
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h2 className="mb-5 text-2xl font-bold text-white">Developer Feed</h2>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {!feed && !error && <p className="text-white/90">Loading feed...</p>}

      {feed?.length === 0 && (
        <p className="rounded-lg bg-white/90 px-4 py-3 text-slate-700">
          No users available in feed right now.
        </p>
      )}

      {feed?.length > 0 && (
        <UserCard
          user={feed[0]}
          loading={actionLoading}
          onIgnore={() => handleCardAction("ignored", feed[0]._id)}
          onInterested={() => handleCardAction("interested", feed[0]._id)}
        />
      )}
    </div>
  );
};

export default Feed;