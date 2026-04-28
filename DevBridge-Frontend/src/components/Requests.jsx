import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Requests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const errorText =
    typeof error === "string"
      ? error
      : error?.message || JSON.stringify(error || "");

  const fetchRequests = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = type === "received" ? "/user/requests/received" : "/user/requests/sent";
      const res = await axios.get(BASE_URL + endpoint, {
        withCredentials: true,
      });
      // Do not guess payload shape. Backend contract must always return { data: [] }.
      // Fallback logic masks API bugs and can map sender/receiver incorrectly.
      const payload = res?.data?.data;
      setRequests(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err?.response?.data || `Failed to load ${type} requests.`);
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        BASE_URL + `/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      // Remove the reviewed request from state
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error("Failed to review request", err);
      alert(err?.response?.data || "Something went wrong.");
    }
  };

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Match Requests</h1>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 shadow-inner">
          <button
            onClick={() => setActiveTab("received")}
            className={`flex-1 rounded-lg px-6 py-2 text-sm font-semibold transition sm:flex-none ${
              activeTab === "received"
                ? "bg-white text-violet-700 shadow"
                : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`flex-1 rounded-lg px-6 py-2 text-sm font-semibold transition sm:flex-none ${
              activeTab === "sent"
                ? "bg-white text-violet-700 shadow"
                : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
            }`}
          >
            Sent
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-20 flex justify-center text-xl font-semibold text-violet-600">
          Loading {activeTab} requests...
        </div>
      )}

      {error && !loading && (
        <div className="mt-20 flex w-full justify-center">
            <div className="rounded-lg bg-red-50 border border-red-200 px-6 py-4 text-center text-lg font-semibold text-red-600 shadow-sm max-w-md">
                {errorText}
                {activeTab === "sent" && errorText.includes("404") && (
                   <p className="mt-2 text-sm text-red-500 font-normal">If your backend lacks the `/user/requests/sent` route, you may see a 404.</p>
                )}
            </div>
        </div>
      )}

      {!loading && !error && (!requests || requests.length === 0) && (
        <div className="mx-auto mt-20 flex max-w-sm flex-col items-center justify-center text-center px-4">
          <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-violet-100/60 blur-2xl"></div>
            <svg
              className="relative h-28 w-28 text-violet-500 drop-shadow-sm"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="20" y="30" width="60" height="40" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
              <path d="M20 35 L50 55 L80 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="75" cy="25" r="10" fill="currentColor" />
              <path d="M71 25 L75 29 L81 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            {activeTab === "received" ? "You're all caught up!" : "No sent requests"}
          </h2>
          <p className="mt-3 font-medium leading-relaxed text-slate-500">
            {activeTab === "received"
              ? "You don't have any pending match requests right now. Check back later or keep exploring your feed."
              : "You haven't sent any connection requests yet. Head over to Discover to meet new developers!"}
          </p>
        </div>
      )}

      {!loading && !error && requests?.length > 0 && (
        <div className="flex flex-col gap-4">
          {requests.map((req) => {
            // Sender/receiver flow:
            // - received tab shows requests sent TO me, so render sender profile from req.fromUserId
            // - sent tab shows requests sent BY me, so render receiver profile from req.toUserId
            // Never fallback to arbitrary keys, otherwise requests can appear under the wrong user.
            const user = activeTab === "received" ? req.fromUserId : req.toUserId;

            if (!user || (!user._id && !user.id)) return null;

            const requestKey = req._id || `${activeTab}-${user._id || user.id}`;
            return (
              <div
                key={requestKey}
                className="flex flex-col gap-4 rounded-xl border border-violet-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      user.photoUrl ||
                      "https://api.dicebear.com/9.x/thumbs/svg?seed=" + (user.firstName || "User")
                    }
                    alt={user.firstName}
                    className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {user.firstName} {user.lastName}
                      {user.age && (
                        <span className="ml-2 font-normal text-slate-500">{user.age}</span>
                      )}
                    </h3>
                    {user.gender && (
                      <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-violet-600">
                        {user.gender}
                      </p>
                    )}
                    <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                      {user.about || (activeTab === "received" ? "Wants to connect with you!" : "Request pending decision.")}
                    </p>
                  </div>
                </div>

                {activeTab === "received" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => reviewRequest("rejected", req._id)}
                      className="flex-1 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 sm:flex-none"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => reviewRequest("accepted", req._id)}
                      className="flex-1 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 sm:flex-none"
                    >
                      Accept
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                     <span className="rounded-lg bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500 border border-slate-200">
                       Pending
                     </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Requests;
