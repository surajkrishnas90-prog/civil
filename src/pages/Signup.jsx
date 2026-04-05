import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { createUserProfile } from "../services/db";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Alert from "../components/ui/Alert";
import { HardHat } from "lucide-react";

const roleOptions = [
  { value: "client", label: "Client – I'm looking to hire" },
  { value: "engineer", label: "Engineer – I offer services" },
];

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await createUserProfile(cred.user.uid, {
        name, email, role, isBanned: false, isVerified: false, kycStatus: "pending",
        profileImage: "", skills: [], experience: "", location: "", createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const { user } = cred;
      await createUserProfile(user.uid, {
        name: user.displayName || "", email: user.email, role,
        isBanned: false, isVerified: false, kycStatus: "not_submitted",
        profileImage: user.photoURL || "", skills: [], experience: "", location: "", createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl mb-5 shadow-lg shadow-brand-500/30">
                <HardHat size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-navy-900">Create your account</h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">Join BuildConnect today</p>
            </div>

            <Alert type="error" message={error} />

            <div className="mt-4">
              <Select label="I am signing up as" value={role} onChange={(e) => setRole(e.target.value)} options={roleOptions} />
            </div>

            <Button variant="outline" className="w-full mt-4" isLoading={googleLoading} onClick={handleGoogle}>
              <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <Input label="Full Name" type="text" placeholder="John Smith" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button type="submit" className="w-full" isLoading={loading}>Create Account</Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-600 font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function getFriendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use": return "This email is already registered.";
    case "auth/invalid-email": return "Please enter a valid email address.";
    case "auth/weak-password": return "Password is too weak.";
    case "auth/popup-closed-by-user": return "Google sign-up was cancelled.";
    default: return "Something went wrong. Please try again.";
  }
}
