import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import MainLayout from "../components/layout/MainLayout";
import { ProfileSkeleton } from "../components/ui/Skeletons";
import Alert from "../components/ui/Alert";
import { MapPin, Briefcase, CheckCircle, Mail, ArrowLeft, ExternalLink } from "lucide-react";

export default function EngineerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", id));
        if (!snap.exists()) { setError("Profile not found."); setLoading(false); return; }
        setProfile({ id: snap.id, ...snap.data() });

        const projSnap = await getDocs(query(collection(db, "projects"), where("userId", "==", id)));
        setProjects(projSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <MainLayout><div className="max-w-4xl mx-auto px-6 pt-32 pb-16"><ProfileSkeleton /></div></MainLayout>;
  if (error) return <MainLayout><div className="max-w-4xl mx-auto px-6 pt-32 pb-16"><Alert type="error" message={error} /></div></MainLayout>;

  return (
    <MainLayout>
      {/* Profile Header */}
      <div className="bg-navy-900 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
          <Link to="/engineers" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Engineers
          </Link>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={profile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "E")}&background=22c55e&color=fff&bold=true&size=128`}
              alt={profile.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-white/10 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">{profile.name}</h1>
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-brand-500/20 text-brand-400 text-xs font-bold px-3 py-1 rounded-full">
                    <CheckCircle size={13} /> Verified
                  </span>
                )}
              </div>
              <p className="text-lg text-slate-400 font-medium mb-3">{profile.role || "Engineer"}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-medium">
                {profile.location && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-brand-500" /> {profile.location}</span>}
                {profile.experience && <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-brand-500" /> {profile.experience} experience</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 space-y-12">
        {/* Skills */}
        {profile.skills?.length > 0 && (
          <section>
            <h2 className="text-xl font-display font-bold text-navy-900 mb-5">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <span key={s} className="bg-brand-50 text-brand-700 text-sm font-semibold px-4 py-2 rounded-full">{s}</span>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {profile.email && (
          <section>
            <h2 className="text-xl font-display font-bold text-navy-900 mb-5">Get in Touch</h2>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-3 bg-navy-900 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-navy-800 transition-colors shadow-md"
            >
              <Mail size={18} /> Contact via Email
            </a>
          </section>
        )}

        {/* Portfolio */}
        <section>
          <h2 className="text-xl font-display font-bold text-navy-900 mb-5">Portfolio Projects</h2>
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No portfolio projects uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group">
                  {proj.images?.[0] && (
                    <div className="h-48 overflow-hidden">
                      <img src={proj.images[0]} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-display font-bold text-navy-900 text-lg mb-2">{proj.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{proj.description}</p>
                    {proj.images?.length > 1 && (
                      <p className="text-xs text-brand-600 font-semibold mt-3 flex items-center gap-1">
                        <ExternalLink size={12} /> {proj.images.length} images
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
