import React from "react";
import loginIllustration from "../assets/login-illustration.svg"
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";


const Login = () => {
  const [emailId, setEmailId] = useState("IronMan@mail.com");
  const [passWord, setPassWord] = useState("Iron@1234");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
      e.preventDefault();
      try{
        const res = await axios.post( BASE_URL + "/login", {
          emailId,
          passWord,
        } , {withCredentials : true});
        console.log(res?.data);
        dispatch(addUser(res.data));
        return navigate("/");
      }
      catch(err){
        console.log(err);
      }
  }

  return (
    <div className="min-h-screen bg-[#cfe6f8] px-6 py-10 flex items-center justify-center font-sans">
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
          <h2 className="m-0 text-3xl font-bold text-slate-900">Sign in</h2>

          <p className="mt-2 mb-6 text-sm text-slate-500">
            New to DevBridge?{" "}
            <span className="text-[#0a66c2] font-semibold cursor-pointer">
              Join now
            </span>
          </p>

          <form className="flex flex-col gap-2" onSubmit={handleLogin}>
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
            />

            <button
              type="submit"
              className="mt-5 h-11 rounded-md bg-[#0a66c2] text-white font-semibold hover:bg-[#0958a9] transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;