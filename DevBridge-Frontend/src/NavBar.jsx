import { Link } from "react-router-dom";

function NavBar() {
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
          <Link
            to="/login"
            className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
          >
            Login
          </Link>
          <Link
            to="/profile"
            className="rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-fuchsia-700"
          >
            Profile
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
