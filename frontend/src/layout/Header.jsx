import { Search, LogOut, Bell, Menu } from "lucide-react";

export default function Header({ onMenuClick }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md md:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:flex max-w-md w-full relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="w-full bg-slate-50 text-sm text-slate-900 border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all outline-none placeholder:text-slate-500"
            placeholder="Search patients, medicines, or ID..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 font-mono text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <span className="hidden sm:inline-block">Logout</span>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}