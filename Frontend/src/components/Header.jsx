import { useRef, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/useApi";
import useSidebarStore from "../store/sidebarStore";
import Loader from "./Loader";
import Logo from "./Logo";

const Header = () => {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search
  const changeInput = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(newValue);
    }, 500);
  };

  const { data, isLoading } = useApi(
    debouncedValue.length > 2
      ? `/suggestion?keyword=${debouncedValue}`
      : null
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?keyword=${value}`);
    resetSearch();
  };

  const navigateToAnimePage = (id) => {
    navigate(`/anime/${id}`);
    resetSearch();
  };

  const resetSearch = () => {
    setValue("");
    setDebouncedValue("");
    setIsMobileOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/95 via-black/80 to-transparent backdrop-blur-xl border-b border-gray-800/50">
      <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left - Logo & Menu */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="text-white hover:text-blue-400 p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
          >
            <Menu size={22} />
          </button>
          <Logo />
        </div>

        {/* Desktop Search - Premium Styling */}
        <form
          onSubmit={handleSubmit}
          className="hidden md:flex relative flex-1 max-w-xl"
        >
          <div className="relative w-full">
            <input
              value={value}
              onChange={changeInput}
              placeholder="Search anime by title, genre, or character..."
              className="w-full bg-gray-900/80 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            {value && (
              <button
                type="button"
                onClick={resetSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-white hover:text-blue-400 p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
        >
          {isMobileOpen ? <X size={24} /> : <Search size={22} />}
        </button>
      </div>

      {/* Mobile Search Panel - Smooth Transition */}
      {isMobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800/50 p-4 animate-slideDown">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                value={value}
                onChange={changeInput}
                placeholder="Search anime..."
                className="w-full bg-gray-900/80 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </form>
        </div>
      )}

      {/* Search Results - Premium Dropdown */}
      {(value.length > 2 && isMobileOpen) || (value.length > 2 && (
        <div className="absolute right-0 w-[600px] bg-gray-900/95 backdrop-blur-xl max-h-[60vh] overflow-y-auto border-t border-gray-800/50 shadow-2xl">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : data?.data?.length ? (
            <>
              <div className="px-4 py-3 border-b border-gray-800/50">
                <p className="text-sm text-gray-400">
                  Found {data.data.length} results
                </p>
              </div>
              
              {data.data.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigateToAnimePage(item.id)}
                  className="flex gap-4 px-4 py-3 hover:bg-gray-800/70 cursor-pointer group border-b border-gray-800/30 last:border-b-0 transition-colors duration-200"
                >
                  <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {item.alternativeTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-800/50 rounded text-gray-300">
                        {item.type || "TV"}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-900/30 rounded text-blue-300">
                        Score: {item.score || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                className="w-full py-4 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Search size={18} />
                View All Results for "{value}"
              </button>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-400 mb-2">No results found</p>
              <p className="text-sm text-gray-500">Try different keywords</p>
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Header;