import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import EngineerCard from "../components/engineers/EngineerCard";
import { CardSkeleton } from "../components/ui/Skeletons";
import Alert from "../components/ui/Alert";
import { getEngineers } from "../services/db";
import { Search, MapPin, Briefcase, ArrowRight, CheckCircle, MessageSquare, Star, ChevronRight } from "lucide-react";

const engineerTypes = ["All Types", "Civil Engineer", "Structural Engineer", "Design Engineer", "Geotechnical", "Environmental"];
const locations = ["All Locations", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"];
const experiences = ["Any Level", "1-3 years", "3-5 years", "5-10 years", "10+ years"];

const HOW_IT_WORKS = [
  { step: 1, icon: Search, title: "Search & Filter", description: "Find qualified professionals tailored precisely to your project's technical requirements." },
  { step: 2, icon: CheckCircle, title: "Compare Portfolios", description: "Evaluate verified profiles, past project galleries, and client reviews." },
  { step: 3, icon: MessageSquare, title: "Connect Securely", description: "Reach out directly to the experts and start building your future." },
];

export default function Home() {
  const [engineers, setEngineers] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [error, setError] = useState("");

  const [typeFilter, setTypeFilter] = useState("All Types");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [expFilter, setExpFilter] = useState("Any Level");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { engineers: data } = await getEngineers({ pageSize: 4 });
        setEngineers(data);
      } catch (e) {
        setError("Failed to load featured engineers.");
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (typeFilter !== "All Types") params.set("type", typeFilter);
    if (locationFilter !== "All Locations") params.set("location", locationFilter);
    if (expFilter !== "Any Level") params.set("exp", expFilter);
    window.location.href = `/engineers?${params.toString()}`;
  };

  return (
    <MainLayout>
      {/* Dynamic Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-navy-900">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-brand-500/20 to-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-brand-600/15 to-purple-600/15 blur-3xl" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-brand-100 text-sm font-semibold px-5 py-2 rounded-full mb-8 backdrop-blur-md shadow-2xl">
            <Star size={14} className="text-brand-500" /> India's Premier Engineering Network
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.1] tracking-tight mb-6 max-w-5xl mx-auto">
            Build the Future with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-emerald-300">
              Verified Excellence
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Connect directly with top civil, structural, and design engineers. Verified professionals bringing your blueprints to life with precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              to="/engineers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-brand-500/30 transition-all hover-lift"
            >
              Find Experts <ArrowRight size={20} />
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-4 rounded-2xl backdrop-blur-sm border border-white/10 transition-all hover-lift"
            >
              Join the Network
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Search Bar */}
      <section className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-16">
        <form onSubmit={handleSearch} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-white p-3 flex flex-col md:flex-row gap-3">
          <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Expertise Needed</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-transparent text-slate-800 font-medium text-sm outline-none cursor-pointer appearance-none"
            >
              {engineerTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin size={10} className="text-brand-500" /> Project Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-transparent text-slate-800 font-medium text-sm outline-none cursor-pointer appearance-none"
            >
              {locations.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1 flex items-center gap-1">
              <Briefcase size={10} className="text-brand-500" /> Experience
            </label>
            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="w-full bg-transparent text-slate-800 font-medium text-sm outline-none cursor-pointer appearance-none"
            >
              {experiences.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <button
            type="submit"
            className="bg-navy-900 hover:bg-navy-800 text-white font-semibold px-8 py-4 md:py-0 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md w-full md:w-auto"
          >
            <Search size={18} /> <span className="md:hidden lg:inline">Search</span>
          </button>
        </form>
      </section>

      {/* Featured Engineers */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 tracking-tight">Top Rated Professionals</h2>
              <p className="text-slate-500 mt-2 font-medium">Discover the finest engineers on BuildConnect, ready to deliver.</p>
            </div>
            <Link
              to="/engineers"
              className="group flex items-center gap-2 text-sm font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-5 py-2.5 rounded-full transition-colors"
            >
              Explore all <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {error && <Alert type="error" message={error} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loadingFeatured
              ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
              : engineers.length === 0
              ? <div className="col-span-4 text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-500 font-medium text-lg">Our engineering network is expanding. Check back soon!</p>
                </div>
              : engineers.map((eng) => <EngineerCard key={eng.id} engineer={eng} />)
            }
          </div>
        </div>
      </section>

      {/* How it Works - Premium Redesign */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-3 block">Simple Process</span>
            <h2 className="text-4xl font-display font-bold text-navy-900 tracking-tight">How BuildConnect Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 group hover-lift relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 relative z-10 group-hover:bg-brand-500 transition-colors duration-300">
                  <Icon size={24} className="text-brand-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-display font-bold text-navy-900 mb-3 relative z-10">{title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium relative z-10">{description}</p>
                <div className="absolute bottom-6 right-8 text-8xl font-display font-black text-slate-900/5 tracking-tighter leading-none pointer-events-none">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto bg-navy-900 rounded-[2.5rem] p-10 md:p-20 relative overflow-hidden text-center shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-6 tracking-tight">Elevate Your Next Project</h2>
            <p className="text-xl text-slate-300 mb-10 font-light">Join thousands of leading contractors and elite engineers already building the future on BuildConnect.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-brand-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/30">
                Join Network Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
