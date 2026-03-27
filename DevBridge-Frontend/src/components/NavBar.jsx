import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
function NavBar() {
  const user = useSelector((store) => store.user);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
      await axios.post(BASE_URL + "/logout" , {} , {withCredentials : true});
      dispatch(removeUser());
      return navigate("/login");
    } 
    catch(err){
        // Error logic will be redirect 
    }
  }

  const profileImage =
    user?.photoUrl || "https://api.dicebear.com/9.x/thumbs/svg?seed=DevBridge";

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/80 bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50 shadow-sm backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-base font-bold text-white shadow-md">
            DB
          </div>
          <h1 className="hidden bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:block">
            DevBridge
          </h1>
          <h1 className="bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:hidden">
            DB
          </h1>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-violet-700 md:flex">
          <a href="#" className="transition hover:text-fuchsia-600">
            Discover
          </a>
          <a href="#" className="transition hover:text-fuchsia-600">
            Match
          </a>
          <a href="#" className="transition hover:text-fuchsia-600">
            Community
          </a>
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <Link
              to="/login"
              className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
            >
              Login
            </Link>
          )}
          {user && (
            <div className="relative flex items-center gap-3">
              <span className="hidden text-sm font-semibold text-violet-700 sm:block">
                Hii {user?.firstName || "there"}
              </span>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open user menu"
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-violet-200 bg-white shadow-sm transition hover:border-fuchsia-400"
              >
                <img
                  src={profileImage}
                  alt={`${user?.firstName || "User"} avatar`}
                  className="h-full w-full object-cover"
                />
              </button>

              {open && (
                <div className="absolute right-0 top-12 w-44 overflow-hidden rounded-xl border border-violet-100 bg-white shadow-lg">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setOpen(false);
                      await handleLogout();
                    }}
                    className="block w-full px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
