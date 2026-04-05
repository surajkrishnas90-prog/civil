import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { HardHat, Menu, X, ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react";

export default function Navbar() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/engineers", label: "Find Engineers" },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-display font-extrabold text-2xl tracking-tight">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30">
              <HardHat size={22} className="text-white" />
            </div>
            <span className={scrolled ? "text-slate-900" : "text-white"}>
              Build<span className="text-brand-500">Connect</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors duration-200 ${
                    isActive 
                      ? "text-brand-500" 
                      : scrolled ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-3 px-1 py-1 pr-3 rounded-full border transition-all ${
                    scrolled 
                      ? "border-slate-200 bg-white hover:bg-slate-50 shadow-sm" 
                      : "border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <img
                    src={userProfile?.profileImage || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=22c55e&color=fff`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
                  />
                  <span className={`text-sm font-semibold max-w-[120px] truncate ${scrolled ? "text-slate-700" : "text-white"}`}>
                    {user.displayName || user.email}
                  </span>
                  <ChevronDown size={14} className={scrolled ? "text-slate-400" : "text-white/70"} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-slate-400" /> Dashboard
                    </Link>
                    {userProfile?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Shield size={16} className="text-slate-400" /> Admin Panel
                      </Link>
                    )}
                    <div className="mx-4 my-2 border-t border-slate-100"></div>
                    <button
                      onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-3 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="text-red-500" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-semibold px-4 py-2 transition-colors ${
                    scrolled ? "text-slate-700 hover:text-slate-900" : "text-white hover:text-white/80"
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-full shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              scrolled ? "text-slate-800 hover:bg-slate-100" : "text-white hover:bg-white/10"
            }`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="text-base font-semibold text-slate-700 hover:text-brand-500 transition-colors py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-slate-100 my-2"></div>
          {user ? (
            <>
               <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-slate-700 hover:text-brand-500 py-2">Dashboard</Link>
               <button onClick={handleLogout} className="text-base font-semibold text-red-600 py-2 text-left">Sign Out</button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-slate-700 text-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50">Log In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-base font-semibold bg-brand-500 text-white text-center py-3 rounded-xl shadow-md shadow-brand-500/20 hover:bg-brand-600">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
