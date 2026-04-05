import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import EngineerCard from "../components/engineers/EngineerCard";
import { CardSkeleton } from "../components/ui/Skeletons";
import Alert from "../components/ui/Alert";
import { getEngineers } from "../services/db";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 9;
const engineerTypes = ["All Types", "Civil Engineer", "Structural Engineer", "Design Engineer", "Geotechnical", "Environmental"];
const locations = ["All Locations", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"];
const experiences = ["Any Level", "1-3 years", "3-5 years", "5-10 years", "10+ years"];

export default function Engineers() {
  const [searchParams] = useSearchParams();
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pages, setPages] = useState([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "All Types");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "All Locations");
  const [expFilter, setExpFilter] = useState(searchParams.get("exp") || "Any Level");
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchPage = useCallback(async (lastDoc) => {
    setLoading(true);
    setError("");
    try {
      const { engineers: data, lastDoc: newLast, hasMore: more } = await getEngineers({ pageSize: PAGE_SIZE, lastDoc });
      setEngineers(data);
      setHasMore(more);
      if (more && newLast) {
        setPages((prev) => {
          const updated = [...prev];
          if (!updated[currentPage + 1]) updated[currentPage + 1] = newLast;
          return updated;
        });
      }
    } catch {
      setError("Failed to load engineers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPage(pages[currentPage]);
  }, [currentPage]); // eslint-disable-line

  const goNext = () => { setCurrentPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goPrev = () => { setCurrentPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const displayed = engineers.filter((eng) => {
    const textMatch = searchText === "" || eng.name?.toLowerCase().includes(searchText.toLowerCase());
    return textMatch;
  });

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-navy-900 pt-28 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3">Find Engineers</h1>
          <p className="text-slate-400 text-lg font-medium">Browse and connect with verified engineering professionals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Search + filter bar */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 mb-10">
          <div className="flex gap-3 flex-wrap items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search engineers by name…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-2xl border transition-all ${
                showFilters ? "bg-brand-50 border-brand-200 text-brand-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-slate-100">
              {[
                { label: "Type", value: typeFilter, setter: setTypeFilter, options: engineerTypes },
                { label: "Location", value: locationFilter, setter: setLocationFilter, options: locations },
                { label: "Experience", value: expFilter, setter: setExpFilter, options: experiences },
              ].map(({ label, value, setter, options }) => (
                <div key={label} className="flex flex-col gap-1.5 flex-1 min-w-40">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:border-brand-500 cursor-pointer"
                  >
                    {options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <CardSkeleton key={i} />)
            : displayed.length === 0
            ? (
              <div className="col-span-3 text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="font-display font-bold text-navy-900 text-xl mb-2">No engineers found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your search or filters.</p>
              </div>
            )
            : displayed.map((eng) => <EngineerCard key={eng.id} engineer={eng} />)
          }
        </div>

        {/* Pagination */}
        {!loading && engineers.length > 0 && (
          <div className="flex items-center justify-center gap-4 py-6">
            <button
              onClick={goPrev}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full">Page {currentPage + 1}</span>
            <button
              onClick={goNext}
              disabled={!hasMore}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
