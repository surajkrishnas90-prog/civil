import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Alert from "../components/ui/Alert";
import { HardHat } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
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
      await signInWithPopup(auth, googleProvider);
      navigate(from, { replace: true });
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
              <h1 className="text-2xl font-display font-bold text-navy-900">Welcome back</h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">Sign in to your BuildConnect account</p>
            </div>

            <Alert type="error" message={error} />

            <Button variant="outline" className="w-full mt-4" isLoading={googleLoading} onClick={handleGoogle}>
              <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button type="submit" className="w-full" isLoading={loading}>Sign In</Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-brand-600 font-bold hover:underline">Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function getFriendlyError(code) {
  switch (code) {
    case "auth/user-not-found": return "No account found with this email.";
    case "auth/wrong-password": return "Incorrect password.";
    case "auth/invalid-credential": return "Invalid email or password.";
    case "auth/too-many-requests": return "Too many attempts. Please try again later.";
    case "auth/popup-closed-by-user": return "Google sign-in was cancelled.";
    default: return "Something went wrong. Please try again.";
  }
}
