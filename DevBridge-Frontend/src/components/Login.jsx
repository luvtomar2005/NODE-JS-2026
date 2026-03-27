import React from "react";
import loginIllustration from "../assets/login-illustration.svg"
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";


const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("IronMan@gmail.com");
  const [passWord, setPassWord] = useState("Iron@1234");
  const [error , setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
      setSuccessMsg("");
      try{
        const res = await axios.post( BASE_URL + "/login", {
          emailId,
          passWord,
        } , {withCredentials : true});
        dispatch(addUser(res.data));
        return navigate("/feed");
      }
      catch(err){
        setError(err?.response?.data || "Something went wrong");
        console.log(err);
      }
  }

  const handleSignup = async (e) => {
      e.preventDefault();
      setError("");
      setSuccessMsg("");
      try{
        const res = await axios.post( BASE_URL + "/signup", {
          firstName,
          lastName,
          emailId,
          passWord,
        } , {withCredentials : true});
        setSuccessMsg("Account created successfully! Please sign in.");
        setIsLoginForm(true);
      }
      catch(err){
        setError(err?.response?.data || "Something went wrong during signup");
        console.log(err);
      }
  }

  return (
    <div className="px-6 py-10 flex items-center justify-center font-sans">
      <div className="w-full max-w-[920px] min-h-[500px] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] grid grid-cols-1 md:grid-cols-[1fr_1.15fr]">
        
        <div className="bg-[#d7e9f7] px-9 pt-12 pb-6 flex flex-col">
          <h1 className="m-0 text-[#0a66c2] text-4xl font-bold">DevBridge</h1>
          <p className="mt-2 mb-6 text-[#1b4f86] text-sm font-semibold">
            Connect. Build. Grow.
          </p>
          <img
            className="mt-auto w-[82%] max-w-[280px] self-center opacity-95"
            src={loginIllustration}
            alt="Work collaboration illustration"
          />
        </div>

        <div className="bg-[#f8f8f8] px-8 py-14 md:px-12 flex flex-col justify-center">
          <h2 className="m-0 text-3xl font-bold text-slate-900">{isLoginForm ? "Sign in" : "Sign up"}</h2>

          <p className="mt-2 mb-6 text-sm text-slate-500">
            {isLoginForm ? "New to DevBridge? " : "Already have an account? "}
            <span 
              className="text-[#0a66c2] font-semibold cursor-pointer hover:underline"
              onClick={() => {
                setIsLoginForm(!isLoginForm);
                setError("");
                setSuccessMsg("");
              }}
            >
              {isLoginForm ? "Join now" : "Sign in"}
            </span>
          </p>

          {successMsg && (
            <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {successMsg}
            </p>
          )}

          <form className="flex flex-col gap-2" onSubmit={isLoginForm ? handleLogin : handleSignup}>
            {!isLoginForm && (
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col">
                  <label htmlFor="firstName" className="text-xs text-slate-500 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Tony"
                    className="h-11 rounded-md border border-slate-300 px-3 text-sm text-slate-900 bg-white outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                    required
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <label htmlFor="lastName" className="text-xs text-slate-500 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Stark"
                    className="h-11 rounded-md border border-slate-300 px-3 text-sm text-slate-900 bg-white outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>
            )}

            <label htmlFor="email" className="text-xs text-slate-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="Enter your email"
              className="h-11 rounded-md border border-slate-300 px-3 text-sm text-slate-900 bg-white outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
              required
            />

            <label htmlFor="password" className="mt-2 text-xs text-slate-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={passWord}
              onChange={(e) => setPassWord(e.target.value)}
              placeholder="Enter password"
              className="h-11 rounded-md border border-slate-300 px-3 text-sm text-slate-900 bg-white outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
              required
            />
            {error && (
              <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-5 h-11 rounded-md bg-[#0a66c2] text-white font-semibold hover:bg-[#0958a9] transition-colors"
            >
              {isLoginForm ? "Sign in" : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;