import { Link } from "react-router-dom";
import { HardHat, ExternalLink, Globe, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 font-display font-extrabold text-2xl tracking-tight mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30">
                <HardHat size={22} className="text-white" />
              </div>
              <span className="text-white">Build<span className="text-brand-500">Connect</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              We connect visionary clients with the absolute best construction and engineering talent for projects that shape the future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-2 lg:col-start-7">
            <h4 className="font-display font-bold text-white mb-6 tracking-wide">Platform</h4>
            <ul className="space-y-4">
              {[{ to: "/", label: "Home" }, { to: "/engineers", label: "Find Engineers" }, { to: "/login", label: "Log In" }, { to: "/signup", label: "Sign Up" }].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm font-medium text-slate-400 hover:text-brand-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="md:col-span-4 lg:col-span-3 lg:col-start-10">
            <h4 className="font-display font-bold text-white mb-6 tracking-wide">Reach Out</h4>
            <div className="flex flex-col gap-4 mb-8">
               <a href="mailto:hello@buildconnect.com" className="flex items-center gap-3 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Mail size={14}/></div>
                  hello@buildconnect.com
               </a>
               <a href="tel:+1234567890" className="flex items-center gap-3 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Phone size={14}/></div>
                  +1 (555) 123-4567
               </a>
            </div>
            
            <div className="flex gap-3">
              {[ExternalLink, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-brand-500 hover:text-white transition-all hover-lift">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-500">© {new Date().getFullYear()} BuildConnect. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
