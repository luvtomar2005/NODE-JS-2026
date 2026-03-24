function Footer() {
  return (
    <footer className="mt-10 border-t border-violet-200 bg-gradient-to-r from-indigo-50 via-white to-fuchsia-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-700 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-violet-700">DevBridge</p>
          <p className="text-xs text-slate-500">
            Connecting developers for projects and growth.
          </p>
        </div>

        <div className="text-xs text-slate-600">
          <p>
            Built by <span className="font-semibold text-violet-700">Luv Tomar</span>
          </p>
          <p>Contact: luvtomar2005@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
