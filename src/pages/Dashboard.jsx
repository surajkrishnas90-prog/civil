import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Alert from "../components/ui/Alert";
import { PageLoader } from "../components/ui/Skeletons";
import { updateUserProfile, getUserProjects, createProject, deleteProject, submitKyc } from "../services/db";
import { uploadToCloudinary } from "../services/cloudinary";
import { User, FolderOpen, ShieldCheck, Plus, Trash2, Upload, Camera } from "lucide-react";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "projects", label: "Projects", icon: FolderOpen },
  { key: "kyc", label: "KYC Verification", icon: ShieldCheck },
];

export default function Dashboard() {
  const { user, userProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (!userProfile) return <MainLayout><PageLoader /></MainLayout>;

  return (
    <MainLayout>
      <div className="bg-navy-900 pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight mb-1">Dashboard</h1>
          <p className="text-slate-400 font-medium">Manage your BuildConnect profile and projects</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-6 pb-16">
        {/* Tab Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1.5 flex gap-1 mb-8 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === key
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && <ProfileTab user={user} profile={userProfile} refreshProfile={refreshProfile} />}
        {activeTab === "projects" && <ProjectsTab userId={user.uid} />}
        {activeTab === "kyc" && <KycTab userId={user.uid} profile={userProfile} refreshProfile={refreshProfile} />}
      </div>
    </MainLayout>
  );
}

// ─── Profile Tab ─────────────────────────
function ProfileTab({ user, profile, refreshProfile }) {
  const [name, setName] = useState(profile.name || "");
  const [location, setLocation] = useState(profile.location || "");
  const [experience, setExperience] = useState(profile.experience || "");
  const [skills, setSkills] = useState(profile.skills?.join(", ") || "");
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(user.uid, {
        name,
        location,
        experience,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      await refreshProfile();
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch {
      setMsg({ type: "error", text: "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      await updateUserProfile(user.uid, { profileImage: url });
      await refreshProfile();
      setMsg({ type: "success", text: "Photo updated!" });
    } catch {
      setMsg({ type: "error", text: "Upload failed." });
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10">
      <h2 className="text-xl font-display font-bold text-navy-900 mb-6">Edit Profile</h2>
      <Alert type={msg.type} message={msg.text} />

      {/* Avatar */}
      <div className="flex items-center gap-5 my-6">
        <div className="relative group">
          <img
            src={profile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=22c55e&color=fff&size=96`}
            alt="avatar"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
          />
          <label className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            {imgLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            ) : (
              <Camera size={20} className="text-white" />
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} disabled={imgLoading} />
          </label>
        </div>
        <div>
          <p className="text-sm font-bold text-navy-900">{profile.name || "Your Name"}</p>
          <p className="text-xs text-slate-400 font-medium capitalize">{profile.role} account</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mumbai, India" />
        <Input label="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5 years" />
        <Input label="Skills (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. Structural Design, AutoCAD, BIM" />
        <Button type="submit" className="w-full sm:w-auto" isLoading={loading}>Save Changes</Button>
      </form>
    </div>
  );
}

// ─── Projects Tab ────────────────────────
function ProjectsTab({ userId }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getUserProjects(userId);
      setProjects(data);
    } catch {
      setMsg({ type: "error", text: "Failed to load projects." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, [userId]); // eslint-disable-line

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadToCloudinary(f)));
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setMsg({ type: "error", text: "Image upload failed." });
    } finally {
      setUploading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await createProject({ userId, title, description, images, createdAt: new Date() });
      setTitle(""); setDescription(""); setImages([]); setShowForm(false);
      await fetchProjects();
      setMsg({ type: "success", text: "Project added!" });
    } catch {
      setMsg({ type: "error", text: "Failed to add project." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projId) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(projId);
      await fetchProjects();
      setMsg({ type: "success", text: "Project deleted." });
    } catch {
      setMsg({ type: "error", text: "Failed to delete project." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-navy-900">My Projects</h2>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "primary"}>
          <Plus size={16} /> {showForm ? "Cancel" : "Add Project"}
        </Button>
      </div>

      <Alert type={msg.type} message={msg.text} />

      {showForm && (
        <form onSubmit={handleAddProject} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-4">
          <Input label="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Mumbai Metro Station Design" />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all resize-none"
              placeholder="Describe the project scope, your role, and key achievements…"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Project Images</label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
              <Upload size={16} /> {uploading ? "Uploading..." : "Upload Images"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
            {images.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {images.map((url, i) => (
                  <img key={i} src={url} alt="" className="w-20 h-20 rounded-xl object-cover border border-slate-100 shadow-sm" />
                ))}
              </div>
            )}
          </div>
          <Button type="submit" isLoading={saving}>Save Project</Button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-400"><svg className="animate-spin h-8 w-8 mx-auto text-brand-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">No projects yet. Add your first portfolio project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm group">
              {proj.images?.[0] && <img src={proj.images[0]} alt="" className="w-full h-44 object-cover" />}
              <div className="p-6">
                <h3 className="font-display font-bold text-navy-900 text-lg mb-2">{proj.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{proj.description}</p>
                <Button variant="danger" onClick={() => handleDelete(proj.id)} className="text-xs"><Trash2 size={14} /> Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── KYC Tab ─────────────────────────────
function KycTab({ userId, profile, refreshProfile }) {
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleKyc = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      await submitKyc(userId, url);
      await refreshProfile();
      setMsg({ type: "success", text: "KYC document submitted for review!" });
    } catch {
      setMsg({ type: "error", text: "KYC submission failed." });
    } finally {
      setUploading(false);
    }
  };

  const statusMap = {
    approved: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "✅ Approved" },
    rejected: { color: "bg-red-50 text-red-700 border-red-200", text: "❌ Rejected" },
    pending: { color: "bg-amber-50 text-amber-700 border-amber-200", text: "⏳ Pending Review" },
  };
  const status = statusMap[profile.kycStatus];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10">
      <h2 className="text-xl font-display font-bold text-navy-900 mb-6">KYC Verification</h2>
      <Alert type={msg.type} message={msg.text} />

      {status && (
        <div className={`inline-flex items-center text-sm font-bold px-4 py-2 rounded-full border mb-6 ${status.color}`}>
          {status.text}
        </div>
      )}

      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Upload a government-issued ID (Aadhaar, PAN, Passport, or Driving License) to verify your identity.
        Once approved, you'll receive the verified badge on your profile.
      </p>

      <label className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 py-3.5 rounded-2xl cursor-pointer transition-colors shadow-md">
        <Upload size={18} /> {uploading ? "Uploading..." : "Upload KYC Document"}
        <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleKyc} disabled={uploading} />
      </label>
    </div>
  );
}
