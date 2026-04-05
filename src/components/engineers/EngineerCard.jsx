import { Link } from "react-router-dom";
import { MapPin, Star, CheckCircle } from "lucide-react";

export default function EngineerCard({ engineer }) {
  const { id, name, profileImage, role, location, experience, isVerified, skills = [] } = engineer;

  return (
    <Link
      to={`/profile/${id}`}
      className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover gradient */}
      <div className="h-28 bg-gradient-to-br from-navy-900 via-brand-600/80 to-brand-500 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 -mt-10 relative z-10">
        <div className="flex items-end gap-4 mb-4">
          <img
            src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "E")}&background=22c55e&color=fff&bold=true&size=96`}
            alt={name}
            className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md"
          />
          <div className="pb-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-navy-900 truncate">{name || "Engineer"}</h3>
              {isVerified && <CheckCircle size={16} className="text-brand-500 shrink-0" />}
            </div>
            <p className="text-sm text-slate-500 font-medium truncate">{role || "Engineer"}</p>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium mb-4">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-slate-400" /> {location}
            </span>
          )}
          {experience && (
            <span className="flex items-center gap-1">
              <Star size={12} className="text-amber-400" /> {experience}
            </span>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((s) => (
              <span key={s} className="text-[11px] font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">
                {s}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
