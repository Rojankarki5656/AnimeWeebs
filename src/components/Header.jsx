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
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/90 to-transparent border-b border-gray-800">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="text-white">
            <Menu size={22} />
          </button>
          <Logo />
        </div>

        {/* Desktop Search */}
        <form
          onSubmit={handleSubmit}
          className="hidden md:flex relative flex-1 max-w-sm"
        >
          <input
            value={value}
            onChange={changeInput}
            placeholder="Search anime..."
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </form>

        {/* Right */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-white"
        >
          {isMobileOpen ? <X size={24} /> : <Search size={22} />}
        </button>
      </div>

      {/* Mobile Search */}
      {isMobileOpen && (
        <div className="md:hidden bg-black/95 border-t border-gray-800 p-4">
          <form onSubmit={handleSubmit} className="relative">
            <input
              value={value}
              onChange={changeInput}
              placeholder="Search anime..."
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </form>
        </div>
      )}

      {/* Search Results */}
      {(value.length > 2 && isMobileOpen) || (value.length > 2 && (
        <div className="absolute w-full bg-black/95 max-h-[60vh] overflow-y-auto border-t border-gray-800">
          {isLoading ? (
            <Loader />
          ) : data?.data?.length ? (
            <>
              {data.data.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigateToAnimePage(item.id)}
                  className="flex gap-4 px-4 py-3 hover:bg-gray-800 cursor-pointer"
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-white line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {item.alternativeTitle}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                className="w-full py-3 text-center bg-primary text-black font-semibold"
              >
                View More Results
              </button>
            </>
          ) : (
            <p className="text-center text-primary py-4">
              Anime not found :(
            </p>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Header;
