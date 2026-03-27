import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import globalCollabBg from "../assets/ChatGPT Image Mar 27, 2026, 09_36_54 AM.png";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    // For preventing unncessary api calls 
    if (userData) return;

    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));
    } catch (err) {
      
      if (err.response && err.response.status === 401) {
        navigate("/login");
      } else {
        console.error("Something went wrong:", err.message);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); 

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main
        className="relative flex-1 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${globalCollabBg})` }}
      >
        <div className="absolute inset-0 bg-slate-900/25"></div>
        <div className="relative z-10 h-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Body;