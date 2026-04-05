import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { PageLoader } from "../components/ui/Skeletons";
import { Users, ShieldCheck, FolderOpen, CheckCircle, XCircle, Ban, UserCheck } from "lucide-react";

const ADMIN_TABS = [
  { key: "users", label: "Users", icon: Users },
  { key: "kyc", label: "KYC Requests", icon: ShieldCheck },
  { key: "projects", label: "All Projects", icon: FolderOpen },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [kycRequests, setKycRequests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userSnap = await getDocs(collection(db, "users"));
        setUsers(userSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        const kycSnap = await getDocs(collection(db, "kyc"));
        setKycRequests(kycSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        const projSnap = await getDocs(collection(db, "projects"));
        setProjects(projSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        setMsg({ type: "error", text: "Failed to load data." });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggleBan = async (userId, currentBan) => {
    try {
      await updateDoc(doc(db, "users", userId), { isBanned: !currentBan });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isBanned: !currentBan } : u));
      setMsg({ type: "success", text: `User ${!currentBan ? "banned" : "unbanned"} successfully.` });
    } catch {
      setMsg({ type: "error", text: "Action failed." });
    }
  };

  const verifyUser = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { isVerified: true });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isVerified: true } : u));
      setMsg({ type: "success", text: "User verified!" });
    } catch {
      setMsg({ type: "error", text: "Verification failed." });
    }
  };

  const promoteToAdmin = async (userId) => {
    if (!window.confirm("Are you sure you want to promote this user to Admin?")) return;
    try {
      await updateDoc(doc(db, "users", userId), { role: "admin" });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: "admin" } : u));
      setMsg({ type: "success", text: "User promoted to admin." });
    } catch {
      setMsg({ type: "error", text: "Promotion failed." });
    }
  };

  const handleKyc = async (kycId, userId, status) => {
    try {
      await updateDoc(doc(db, "kyc", kycId), { status });
      await updateDoc(doc(db, "users", userId), { kycStatus: status, ...(status === "approved" ? { isVerified: true } : {}) });
      setKycRequests((prev) => prev.map((k) => k.id === kycId ? { ...k, status } : k));
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, kycStatus: status, ...(status === "approved" ? { isVerified: true } : {}) } : u));
      setMsg({ type: "success", text: `KYC ${status}.` });
    } catch {
      setMsg({ type: "error", text: "KYC update failed." });
    }
  };

  if (loading) return <MainLayout><PageLoader /></MainLayout>;

  const stats = [
    { label: "Total Users", value: users.length, color: "bg-blue-50 text-blue-700 border-blue-100" },
    { label: "Engineers", value: users.filter((u) => u.role === "engineer").length, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { label: "Pending KYC", value: kycRequests.filter((k) => k.status === "pending").length, color: "bg-amber-50 text-amber-700 border-amber-100" },
    { label: "Projects", value: projects.length, color: "bg-purple-50 text-purple-700 border-purple-100" },
  ];

  return (
    <MainLayout>
      <div className="bg-navy-900 pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight mb-1">Admin Panel</h1>
          <p className="text-slate-400 font-medium">Manage users, KYC requests, and platform content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-2xl border p-5 ${s.color}`}>
              <p className="text-3xl font-display font-extrabold">{s.value}</p>
              <p className="text-sm font-semibold opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end mb-8">
          <Button onClick={async () => {
            const sampleData = [
              { id: "e1", name: "Priya Sharma", email: "priya@example.com", role: "engineer", isVerified: true, isBanned: false, kycStatus: "approved", location: "Bangalore", experience: "5-10 years", skills: ["AutoCAD", "Structural Analysis"], profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" },
              { id: "e2", name: "Rahul Verma", email: "rahul@example.com", role: "engineer", isVerified: true, isBanned: false, kycStatus: "approved", location: "Mumbai", experience: "10+ years", skills: ["Civil Engineering", "Project Management"], profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" },
              { id: "e3", name: "Aisha Patel", email: "aisha@example.com", role: "engineer", isVerified: false, isBanned: false, kycStatus: "pending", location: "Delhi", experience: "3-5 years", skills: ["Architecture", "Revit"], profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" },
              { id: "e4", name: "Vikram Singh", email: "vikram@example.com", role: "engineer", isVerified: true, isBanned: false, kycStatus: "approved", location: "Chennai", experience: "10+ years", skills: ["Geotechnical", "Site Survey"], profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200" }
            ];
            try {
              const { setDoc, doc } = await import("firebase/firestore");
              await Promise.all(sampleData.map(d => setDoc(doc(db, "users", d.id), d)));
              setMsg({ type: "success", text: "Successfully added sample engineers! Refreshing..." });
              setTimeout(() => window.location.reload(), 1500);
            } catch (err) {
              setMsg({ type: "error", text: "Failed to add sample engineers." });
            }
          }} variant="outline" className="text-xs">
            🌱 Seed Sample Engineers
          </Button>
        </div>

        <Alert type={msg.type} message={msg.text} />

        {/* Tab Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1.5 flex gap-1 mb-8 overflow-x-auto mt-4">
          {ADMIN_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === key ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Users Table */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=22c55e&color=fff&size=40`} alt="" className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-sm text-navy-900">{u.name || "—"}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full capitalize">{u.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {u.isVerified && <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">Verified</span>}
                          {u.isBanned && <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Banned</span>}
                          {!u.isVerified && !u.isBanned && <span className="text-[10px] font-bold bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full">Active</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="ghost" onClick={() => toggleBan(u.id, u.isBanned)} className="text-xs px-3 py-1.5">
                            <Ban size={13} /> {u.isBanned ? "Unban" : "Ban"}
                          </Button>
                          {!u.isVerified && (
                            <Button variant="ghost" onClick={() => verifyUser(u.id)} className="text-xs px-3 py-1.5 text-brand-600">
                              <UserCheck size={13} /> Verify
                            </Button>
                          )}
                          {u.role !== "admin" && (
                            <Button variant="ghost" onClick={() => promoteToAdmin(u.id)} className="text-xs px-3 py-1.5 text-blue-600">
                              <ShieldCheck size={13} /> Make Admin
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* KYC Requests */}
        {activeTab === "kyc" && (
          <div className="space-y-4">
            {kycRequests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No KYC requests found.</p>
              </div>
            ) : kycRequests.map((kyc) => {
              const user = users.find((u) => u.id === kyc.userId);
              return (
                <div key={kyc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-navy-900">{user?.name || kyc.userId}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                    <a href={kyc.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand-600 hover:underline mt-1 inline-block">
                      View Document ↗
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      kyc.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                      kyc.status === "rejected" ? "bg-red-50 text-red-700" :
                      "bg-amber-50 text-amber-700"
                    }`}>
                      {kyc.status}
                    </span>
                    {kyc.status === "pending" && (
                      <>
                        <Button variant="primary" onClick={() => handleKyc(kyc.id, kyc.userId, "approved")} className="text-xs px-3 py-1.5">
                          <CheckCircle size={13} /> Approve
                        </Button>
                        <Button variant="danger" onClick={() => handleKyc(kyc.id, kyc.userId, "rejected")} className="text-xs px-3 py-1.5">
                          <XCircle size={13} /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* All Projects */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-3 text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No projects on the platform yet.</p>
              </div>
            ) : projects.map((proj) => {
              const owner = users.find((u) => u.id === proj.userId);
              return (
                <div key={proj.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                  {proj.images?.[0] && <img src={proj.images[0]} alt="" className="w-full h-40 object-cover" />}
                  <div className="p-6">
                    <h3 className="font-display font-bold text-navy-900 mb-1">{proj.title}</h3>
                    <p className="text-xs text-slate-400 font-medium mb-2">by {owner?.name || "Unknown"}</p>
                    <p className="text-sm text-slate-500 line-clamp-2">{proj.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
